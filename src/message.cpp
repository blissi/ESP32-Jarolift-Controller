#include "esp32-hal-log.h"
#include <basics.h>
#include <message.h>
#include <telnet.h>

/* D E C L A R A T I O N S ****************************************************/
#define MSG_BUF_SIZE 1024 // buffer size for messaging

#define HEAP_CHECK_INTERVAL 10000 // check every x seconds
#define HEAP_LOW_PERCENTAGE 10    // min value for free heap in Percentage
#define HEAP_SAMPLE_COUNT 3       // sample count for heap leak

// Heap check variables
static uint32_t totalHeap = 0;
static uint32_t heapSamples[HEAP_SAMPLE_COUNT];
static int sampleIndex = 0;
static const char *TAG = "MSG"; // LOG TAG
s_logdata logData;
esp_log_level_t logLevel;

static muTimer checkHeapTimer = muTimer();
static muTimer mainTimer = muTimer(); // timer for cyclic info

/**
 * *******************************************************************
 * @brief   Function to initialize heap monitoring
 * @param   none
 * @return  none
 * *******************************************************************/
void initHeapMonitoring() {
  totalHeap = esp_get_free_heap_size(); // Get total available heap memory

  // Initialize the ring buffer with the current heap values
  for (int i = 0; i < HEAP_SAMPLE_COUNT; i++) {
    heapSamples[i] = totalHeap;
  }
}

/**
 * *******************************************************************
 * @brief   Function to calculate the moving average of the heap
 * @param   none
 * @return  none
 * *******************************************************************/
size_t getAverageHeap() {
  size_t sum = 0;
  for (int i = 0; i < HEAP_SAMPLE_COUNT; i++) {
    sum += heapSamples[i];
  }
  return sum / HEAP_SAMPLE_COUNT;
}

/**
 * *******************************************************************
 * @brief   Function to monitor the heap status
 * @param   none
 * @return  none
 * *******************************************************************/
void checkHeapStatus() {
  static int filledSamples = 0; // Tracks how many samples have been collected

  // Check if totalHeap has been initialized properly to avoid division by zero
  if (totalHeap == 0) {
    MY_LOGW(TAG, "Error: totalHeap is 0, make sure initHeapMonitoring() was called.");
    return;
  }

  // Get the current free heap
  uint32_t currentHeap = esp_get_free_heap_size();

  // Add the current value to the ring buffer
  heapSamples[sampleIndex] = currentHeap;
  sampleIndex = (sampleIndex + 1) % HEAP_SAMPLE_COUNT;

  // Track the number of samples until the buffer is fully filled at least once
  if (filledSamples < HEAP_SAMPLE_COUNT) {
    filledSamples++;
    return; // Do not perform checks until we have enough samples
  }

  // Calculate the average of the last values
  size_t averageHeap = getAverageHeap();

  // Check if the free heap is below 10% of the total heap
  if ((averageHeap * 100 / totalHeap) < HEAP_LOW_PERCENTAGE) {
    MY_LOGW(TAG, "Warning: Heap memory below %i %%!", HEAP_LOW_PERCENTAGE);
  }
}

/**
 * *******************************************************************
 * @brief   set Log Level for ESP_LOG messages
 * @param   level
 * @return  none
 * *******************************************************************/
void setLogLevel(uint8_t level) {

  if (level == 1) {
    logLevel = ESP_LOG_ERROR;
  } else if (level == 2) {
    logLevel = ESP_LOG_WARN;
  } else if (level == 3) {
    logLevel = ESP_LOG_INFO;
  } else {
    logLevel = ESP_LOG_DEBUG;
  }
  esp_log_level_set("*", logLevel);
}

/**
 * *******************************************************************
 * @brief   custom callback function for ESP_LOG messages
 * @param   format, args
 * @return  vprintf(format, args)
 * *******************************************************************/
int custom_vprintf(const char *format, va_list args) {

  // create a copy
  va_list args_copy;
  va_copy(args_copy, args);

  char message[MAX_LOG_ENTRY];
  vsnprintf(message, sizeof(message), format, args_copy);

  addLogBuffer(message);

  // send to telnet stream
  if (telnetIF.serialStream) { // Provide to Telnet stream (if active)
    telnet.printf(format, args_copy);
    telnetShell();
  }

  // free copy of va_list
  va_end(args_copy);

  return vprintf(format, args);
}

/**
 * *******************************************************************
 * @brief   clear Logbuffer
 * @param   none
 * @return  none
 * *******************************************************************/
void clearLogBuffer() {
  logData.lastLine = 0;
  for (int i = 0; i < MAX_LOG_LINES; i++) {
    memset(logData.buffer[i], 0, sizeof(logData.buffer[i]));
  }
}

/**
 * *******************************************************************
 * @brief   add new entry to LogBuffer
 * @param   none
 * @return  none
 * *******************************************************************/
void addLogBuffer(const char *message) {
  if (strlen(message) != 0) {
    snprintf(logData.buffer[logData.lastLine], sizeof(logData.buffer[logData.lastLine]), "[%s]  %s", getDateTimeString(), message);
    logData.lastLine = (logData.lastLine + 1) % MAX_LOG_LINES; // update the lastLine index in a circular manner
  }
}

/**
 * *******************************************************************
 * @brief   Setup for Telegram bot
 * @param   none
 * @return  none
 * *******************************************************************/
void messageSetup() {

  // Enable serial port
  Serial.begin(115200);

  esp_log_level_set("*", logLevel);
  esp_log_set_vprintf(&custom_vprintf); // set custom vprintf callback function

  initHeapMonitoring();
}

/**
 * *******************************************************************
 * @brief   Message Cyclic Loop
 * @param   none
 * @return  none
 * *******************************************************************/
void messageCyclic() {

  // check HEAP
  if (checkHeapTimer.cycleTrigger(10000)) {
    checkHeapStatus();
  }

  // send cyclic infos
  if (mainTimer.cycleTrigger(10000) && !setupMode && mqttIsConnected()) {
    sendWiFiInfo();
    sendSysInfo();
    if (config.eth.enable) {
      sendETHInfo();
    }
  }
}
