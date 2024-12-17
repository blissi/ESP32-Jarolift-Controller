#include <Arduino.h>
#include <ArduinoJson.h>
#include <LittleFS.h>
#include <basics.h>
#include <config.h>
#include <message.h>
#include <stringHelper.h>

/* D E C L A R A T I O N S ****************************************************/
char filename[24] = {"/config.json"};
bool setupMode;
bool configInitDone = false;
unsigned long hashOld;
s_config config;
muTimer checkTimer = muTimer(); // timer to refresh other values
static const char *TAG = "CFG"; // LOG TAG

/* P R O T O T Y P E S ********************************************************/
void configGPIO();
void configInitValue();
void checkGPIO();

/**
 * *******************************************************************
 * @brief   Setup for intitial configuration
 * @param   none
 * @return  none
 * *******************************************************************/
void configSetup() {

  // start Filesystem
  if (LittleFS.begin(true)) {
    MY_LOGI(TAG, "LittleFS successfully started");
  } else {
    MY_LOGE(TAG, "LittleFS error");
  }

  // load config from file
  configLoadFromFile();
  // check GPIO
  checkGPIO();
  // gpio settings
  configGPIO();
}

/**
 * *******************************************************************
 * @brief   check configured gpio
 * @param   none
 * @return  none
 * *******************************************************************/
#define MAX_GPIO 20
void checkGPIO() {
  short int usedGPIOs[MAX_GPIO];
  short int usedCount = 0;

  auto isDuplicate = [&usedGPIOs, &usedCount](int gpio) {
    if (gpio == -1)
      return false; // -1 ignore
    for (int i = 0; i < usedCount; ++i) {
      if (usedGPIOs[i] == gpio) {
        return true;
      }
    }
    if (usedCount < MAX_GPIO - 1) {
      usedGPIOs[usedCount++] = gpio;
    }
    return false;
  };

  bool invalidcc1101 = false;
  bool invalidETH = false;

  if (config.gpio.led_setup == 0) {
    config.gpio.led_setup = LED_BUILTIN;
  } else if (isDuplicate(config.gpio.led_setup)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (led_setup)", config.gpio.led_setup);
  }

  // CC1101 GPIO
  if (config.gpio.gdo0 == 0) {
    config.gpio.gdo0 = 21;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.gdo0)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.gdo0)", config.gpio.gdo0);
  }

  if (config.gpio.gdo2 == 0) {
    config.gpio.gdo2 = 22;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.gdo2)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.gdo2)", config.gpio.gdo2);
  }

  if (config.gpio.cs == 0) {
    config.gpio.cs = 5;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.cs)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.cs)", config.gpio.cs);
  }

  if (config.gpio.sck == 0) {
    config.gpio.sck = 18;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.sck)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.sck)", config.gpio.sck);
  }

  if (config.gpio.miso == 0) {
    config.gpio.miso = 19;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.miso)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.miso)", config.gpio.miso);
  }

  if (config.gpio.mosi == 0) {
    config.gpio.mosi = 23;
    invalidcc1101 = true;
  } else if (isDuplicate(config.gpio.mosi)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (gpio.mosi)", config.gpio.mosi);
  }

  // Ethernet GPIO
  if (config.eth.gpio_cs == 0) {
    config.eth.gpio_cs = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_cs)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_cs)", config.eth.gpio_cs);
  }

  if (config.eth.gpio_irq == 0) {
    config.eth.gpio_irq = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_irq)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_irq)", config.eth.gpio_irq);
  }

  if (config.eth.gpio_miso == 0) {
    config.eth.gpio_miso = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_miso)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_miso)", config.eth.gpio_miso);
  }

  if (config.eth.gpio_mosi == 0) {
    config.eth.gpio_mosi = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_mosi)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_mosi)", config.eth.gpio_mosi);
  }

  if (config.eth.gpio_rst == 0) {
    config.eth.gpio_rst = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_rst)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_rst)", config.eth.gpio_rst);
  }

  if (config.eth.gpio_sck == 0) {
    config.eth.gpio_sck = -1;
    invalidETH = true;
  } else if (isDuplicate(config.eth.gpio_sck)) {
    MY_LOGE(TAG, "GPIO %d is used multiple times (eth.gpio_sck)", config.eth.gpio_sck);
  }

  if (config.eth.enable && invalidETH) {
    MY_LOGE(TAG, "invalid GPIO settings for Ethernet");
  }
  if (invalidcc1101) {
    MY_LOGE(TAG, "invalid GPIO settings for CC1101");
  }
}

/**
 * *******************************************************************
 * @brief   init hash value
 * @param   none
 * @return  none
 * *******************************************************************/
void configHashInit() {
  hashOld = hash(&config, sizeof(s_config));
  configInitDone = true;
}

/**
 * *******************************************************************
 * @brief   cyclic function for configuration
 * @param   none
 * @return  none
 * *******************************************************************/
void configCyclic() {

  if (checkTimer.cycleTrigger(1000) && configInitDone) {
    unsigned long hashNew = hash(&config, sizeof(s_config));
    if (hashNew != hashOld) {
      hashOld = hashNew;
      configSaveToFile();
      MY_LOGD(TAG, "config saved to file");
    }
  }
}

/**
 * *******************************************************************
 * @brief   Setup for GPIO
 * @param   none
 * @return  none
 * *******************************************************************/
void configGPIO() {

  if (setupMode) {
    if (config.gpio.led_setup <= 0) {
      pinMode(LED_BUILTIN, OUTPUT); // onboard LED
    } else {
      pinMode(config.gpio.led_setup, OUTPUT); // LED for Wifi-Status
    }
  }
}

/**
 * *******************************************************************
 * @brief   intitial configuration values
 * @param   none
 * @return  none
 * *******************************************************************/
void configInitValue() {

  memset((void *)&config, 0, sizeof(config));

  // Logger
  config.log.level = 4;

  // WiFi
  snprintf(config.wifi.hostname, sizeof(config.wifi.hostname), "ESP32-Jarolift");

  // MQTT
  config.mqtt.port = 1883;
  config.mqtt.enable = false;
  snprintf(config.mqtt.ha_topic, sizeof(config.mqtt.ha_topic), "homeassistant");
  snprintf(config.mqtt.ha_device, sizeof(config.mqtt.ha_device), "jarolift");

  // NTP
  snprintf(config.ntp.server, sizeof(config.ntp.server), "de.pool.ntp.org");
  snprintf(config.ntp.tz, sizeof(config.ntp.tz), "CET-1CEST,M3.5.0,M10.5.0/3");
  config.ntp.enable = true;

  // language
  config.lang = 0;

  // gpio
  config.gpio.gdo0 = 21;
  config.gpio.gdo2 = 22;
  config.gpio.sck = 18;
  config.gpio.miso = 19;
  config.gpio.mosi = 23;
  config.gpio.cs = 5;
  config.gpio.led_setup = LED_BUILTIN;
}

/**
 * *******************************************************************
 * @brief   save configuration to file
 * @param   none
 * @return  none
 * *******************************************************************/
void configSaveToFile() {

  JsonDocument doc; // reserviert 2048 Bytes für das JSON-Objekt

  doc["lang"] = (config.lang);

  doc["wifi"]["ssid"] = config.wifi.ssid;
  doc["wifi"]["password"] = config.wifi.password;
  doc["wifi"]["hostname"] = config.wifi.hostname;
  doc["wifi"]["static_ip"] = config.wifi.static_ip;
  doc["wifi"]["ipaddress"] = config.wifi.ipaddress;
  doc["wifi"]["subnet"] = config.wifi.subnet;
  doc["wifi"]["gateway"] = config.wifi.gateway;
  doc["wifi"]["dns"] = config.wifi.dns;

  doc["eth"]["enable"] = config.eth.enable;
  doc["eth"]["hostname"] = config.eth.hostname;
  doc["eth"]["static_ip"] = config.eth.static_ip;
  doc["eth"]["ipaddress"] = config.eth.ipaddress;
  doc["eth"]["subnet"] = config.eth.subnet;
  doc["eth"]["gateway"] = config.eth.gateway;
  doc["eth"]["dns"] = config.eth.dns;
  doc["eth"]["gpio_sck"] = config.eth.gpio_sck;
  doc["eth"]["gpio_mosi"] = config.eth.gpio_mosi;
  doc["eth"]["gpio_miso"] = config.eth.gpio_miso;
  doc["eth"]["gpio_cs"] = config.eth.gpio_cs;
  doc["eth"]["gpio_irq"] = config.eth.gpio_irq;
  doc["eth"]["gpio_rst"] = config.eth.gpio_rst;

  doc["mqtt"]["enable"] = config.mqtt.enable;
  doc["mqtt"]["server"] = config.mqtt.server;
  doc["mqtt"]["user"] = config.mqtt.user;
  doc["mqtt"]["password"] = config.mqtt.password;
  doc["mqtt"]["topic"] = config.mqtt.topic;
  doc["mqtt"]["port"] = config.mqtt.port;
  doc["mqtt"]["ha_enable"] = config.mqtt.ha_enable;
  doc["mqtt"]["ha_topic"] = config.mqtt.ha_topic;
  doc["mqtt"]["ha_device"] = config.mqtt.ha_device;

  doc["ntp"]["enable"] = config.ntp.enable;
  doc["ntp"]["server"] = config.ntp.server;
  doc["ntp"]["tz"] = config.ntp.tz;

  doc["gpio"]["gdo0"] = config.gpio.gdo0;
  doc["gpio"]["gdo2"] = config.gpio.gdo2;
  doc["gpio"]["sck"] = config.gpio.sck;
  doc["gpio"]["miso"] = config.gpio.miso;
  doc["gpio"]["mosi"] = config.gpio.mosi;
  doc["gpio"]["cs"] = config.gpio.cs;
  doc["gpio"]["led_setup"] = config.gpio.led_setup;

  doc["auth"]["enable"] = config.auth.enable;
  doc["auth"]["user"] = config.auth.user;
  doc["auth"]["password"] = config.auth.password;

  doc["logger"]["enable"] = config.log.enable;
  doc["logger"]["level"] = config.log.level;
  doc["logger"]["order"] = config.log.order;

  doc["jaro"]["masterMSB"] = config.jaro.masterMSB;
  doc["jaro"]["masterLSB"] = config.jaro.masterLSB;
  doc["jaro"]["serial"] = config.jaro.serial;

  if (config.jaro.learn_mode == 0) {
    config.jaro.learn_mode = 4; // ESP_LOG_DEBUG
  }
  doc["jaro"]["learn_mode"] = config.jaro.learn_mode;

  JsonArray ch_enable = doc["jaro"]["ch_enable"].to<JsonArray>();
  for (int i = 0; i < 16; i++) {
    ch_enable.add(config.jaro.ch_enable[i]);
  }

  JsonArray ch_name = doc["jaro"]["ch_name"].to<JsonArray>();
  for (int i = 0; i < 16; i++) {
    ch_name.add(config.jaro.ch_name[i]);
  }

  // Delete existing file, otherwise the configuration is appended to the file
  LittleFS.remove(filename);

  // Open file for writing
  File file = LittleFS.open(filename, FILE_WRITE);
  if (!file) {
    MY_LOGE(TAG, "Failed to create file");
    return;
  }

  // Serialize JSON to file
  if (serializeJson(doc, file) == 0) {
    MY_LOGE(TAG, "Failed to write to file");
  } else {
    MY_LOGI(TAG, "config successfully saved to file: %s", filename);
  }

  // Close the file
  file.close();
}

/**
 * *******************************************************************
 * @brief   load configuration from file
 * @param   none
 * @return  none
 * *******************************************************************/
void configLoadFromFile() {
  // Open file for reading
  File file = LittleFS.open(filename);

  // Allocate a temporary JsonDocument
  JsonDocument doc;

  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, file);
  if (error) {
    MY_LOGE(TAG, "Failed to read file, using default configuration and start wifi-AP");
    configInitValue();
    setupMode = true;

  } else {

    config.lang = doc["lang"];

    readJSONstring(config.wifi.ssid, sizeof(config.wifi.ssid), doc["wifi"]["ssid"]);
    readJSONstring(config.wifi.password, sizeof(config.wifi.password), doc["wifi"]["password"]);
    readJSONstring(config.wifi.hostname, sizeof(config.wifi.hostname), doc["wifi"]["hostname"]);
    config.wifi.static_ip = doc["wifi"]["static_ip"];
    readJSONstring(config.wifi.ipaddress, sizeof(config.wifi.ipaddress), doc["wifi"]["ipaddress"]);
    readJSONstring(config.wifi.subnet, sizeof(config.wifi.subnet), doc["wifi"]["subnet"]);
    readJSONstring(config.wifi.gateway, sizeof(config.wifi.gateway), doc["wifi"]["gateway"]);
    readJSONstring(config.wifi.dns, sizeof(config.wifi.dns), doc["wifi"]["dns"]);

    config.eth.enable = doc["eth"]["enable"];
    readJSONstring(config.eth.hostname, sizeof(config.eth.hostname), doc["eth"]["hostname"]);
    config.eth.static_ip = doc["eth"]["static_ip"];
    readJSONstring(config.eth.ipaddress, sizeof(config.eth.ipaddress), doc["eth"]["ipaddress"]);
    readJSONstring(config.eth.ipaddress, sizeof(config.eth.ipaddress), doc["eth"]["ipaddress"]);
    readJSONstring(config.eth.subnet, sizeof(config.eth.subnet), doc["eth"]["subnet"]);
    readJSONstring(config.eth.gateway, sizeof(config.eth.gateway), doc["eth"]["gateway"]);
    readJSONstring(config.eth.dns, sizeof(config.eth.dns), doc["eth"]["dns"]);
    config.eth.gpio_sck = doc["eth"]["gpio_sck"];
    config.eth.gpio_mosi = doc["eth"]["gpio_mosi"];
    config.eth.gpio_miso = doc["eth"]["gpio_miso"];
    config.eth.gpio_cs = doc["eth"]["gpio_cs"];
    config.eth.gpio_irq = doc["eth"]["gpio_irq"];
    config.eth.gpio_rst = doc["eth"]["gpio_rst"];

    config.mqtt.enable = doc["mqtt"]["enable"];
    readJSONstring(config.mqtt.server, sizeof(config.mqtt.server), doc["mqtt"]["server"]);
    readJSONstring(config.mqtt.user, sizeof(config.mqtt.user), doc["mqtt"]["user"]);
    readJSONstring(config.mqtt.password, sizeof(config.mqtt.password), doc["mqtt"]["password"]);
    readJSONstring(config.mqtt.topic, sizeof(config.mqtt.topic), doc["mqtt"]["topic"]);
    config.mqtt.port = doc["mqtt"]["port"];
    config.mqtt.ha_enable = doc["mqtt"]["ha_enable"];
    readJSONstring(config.mqtt.ha_topic, sizeof(config.mqtt.ha_topic), doc["mqtt"]["ha_topic"]);
    readJSONstring(config.mqtt.ha_device, sizeof(config.mqtt.ha_device), doc["mqtt"]["ha_device"]);

    config.ntp.enable = doc["ntp"]["enable"];
    readJSONstring(config.ntp.server, sizeof(config.ntp.server), doc["ntp"]["server"]);
    readJSONstring(config.ntp.tz, sizeof(config.ntp.tz), doc["ntp"]["tz"]);

    config.gpio.led_setup = doc["gpio"]["led_setup"];
    config.gpio.gdo0 = doc["gpio"]["gdo0"];
    config.gpio.gdo2 = doc["gpio"]["gdo2"];
    config.gpio.sck = doc["gpio"]["sck"];
    config.gpio.miso = doc["gpio"]["miso"];
    config.gpio.mosi = doc["gpio"]["mosi"];
    config.gpio.cs = doc["gpio"]["cs"];

    config.auth.enable = doc["auth"]["enable"];
    readJSONstring(config.auth.user, sizeof(config.auth.user), doc["auth"]["user"]);
    readJSONstring(config.auth.password, sizeof(config.auth.password), doc["auth"]["password"]);

    config.log.enable = doc["logger"]["enable"];
    config.log.level = doc["logger"]["level"];
    config.log.order = doc["logger"]["order"];

    config.jaro.masterMSB = doc["jaro"]["masterMSB"];
    config.jaro.masterLSB = doc["jaro"]["masterLSB"];
    config.jaro.serial = doc["jaro"]["serial"];
    config.jaro.learn_mode = doc["jaro"]["learn_mode"];

    JsonArray ch_enable = doc["jaro"]["ch_enable"].as<JsonArray>();
    for (int i = 0; i < 16; i++) {
      config.jaro.ch_enable[i] = ch_enable[i];
    }
    JsonArray ch_name = doc["jaro"]["ch_name"].as<JsonArray>();
    for (int i = 0; i < 16; i++) {
      readJSONstring(config.jaro.ch_name[i], sizeof(config.jaro.ch_name[0]), ch_name[i]);
    }
  }

  if (strlen(config.wifi.ssid) == 0) {
    // no valid wifi setting => start AP-Mode
    MY_LOGW(TAG, "no valid wifi SSID set => enter SetupMode and start AP-Mode");
    setupMode = true;
  }

  file.close();     // Close the file (Curiously, File's destructor doesn't close the file)
  configHashInit(); // init hash value

  // check log level
  if (config.jaro.learn_mode == 0) {
    config.jaro.learn_mode = 4; // ESP_LOG_DEBUG
  }
  setLogLevel(config.log.level);
}

/**
 * *******************************************************************
 * @brief   save restart reason to file
 * @param   reason
 * @return  none
 * *******************************************************************/
void saveRestartReason(const char *reason) {
  File file = LittleFS.open("/restart_reason.txt", "w");
  if (!file) {
    MY_LOGE(TAG, "Failed to open file for writing");
    return;
  }
  file.println(reason);
  file.close();
}

/**
 * *******************************************************************
 * @brief   read restart reason from file
 * @param   buffer
 * @param   bufferSize
 * @return  none
 * *******************************************************************/
bool readRestartReason(char *buffer, size_t bufferSize) {
  if (!LittleFS.exists("/restart_reason.txt")) {
    return false; // no file
  }

  File file = LittleFS.open("/restart_reason.txt", "r");
  if (!file) {
    MY_LOGE(TAG, "Failed to open file for reading");
    return false;
  }

  bool result = false;
  if (file.available()) {
    String line = file.readStringUntil('\n');
    line.trim();
    strncpy(buffer, line.c_str(), bufferSize - 1);
    buffer[bufferSize - 1] = '\0';
    result = true;
  }
  file.close();

  LittleFS.remove("/restart_reason.txt");

  return result;
}