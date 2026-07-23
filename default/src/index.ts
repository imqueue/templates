%LICENSE_HEADER
%ADDON_PRELOAD
import { fileURLToPath } from 'node:url';
import { serviceOptions } from './config.js';
import { %SERVICE_CLASS_NAME } from './%SERVICE_CLASS_NAME.js';

export * from './%SERVICE_CLASS_NAME.js';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        const service = new %SERVICE_CLASS_NAME(serviceOptions);
        await service.start();
    })();
}
