import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "control", loadChildren: () => import('./control/control.module').then(m => m.ControlModule) },
    { path: "group", loadChildren: () => import('./group/group.module').then(m => m.GroupModule) },
    { path: "timer", loadChildren: () => import('./timer/timer.module').then(m => m.TimerModule) },
    { path: "service", loadChildren: () => import('./service/service.module').then(m => m.ServiceModule) },
    { path: "system", loadChildren: () => import('./system/system.module').then(m => m.SystemModule) },
    { path: "logger", loadChildren: () => import('./logger/logger.module').then(m => m.LoggerModule) },
    { path: "tools", loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule) },
    { path: "settings", loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    { path: "help", loadChildren: () => import('./help/help.module').then(m => m.HelpModule) }
];