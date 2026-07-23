%LICENSE_HEADER
%ADDON_PRELOAD
import { serviceOptions } from './config.js';
import { %SERVICE_CLASS_NAME } from './%SERVICE_CLASS_NAME.js';

export * from './%SERVICE_CLASS_NAME.js';

if (import.meta.main) {
    const service = new %SERVICE_CLASS_NAME(serviceOptions);
    await service.start();
}
