%LICENSE_HEADER
import { serviceOptions } from './config';
import { %SERVICE_CLASS_NAME } from './src';

export * from './src';

!module.parent && (async () => {
    const service = new %SERVICE_CLASS_NAME(serviceOptions);
    await service.start();
})();
