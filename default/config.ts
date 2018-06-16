%LICENSE_HEADER
import { IMQServiceOptions } from '@imqueue/rpc';
import { config as initEnvironment } from 'dotenv';

initEnvironment();

/* check environments variables if required to bypass secrets */

export const serviceOptions: Partial<IMQServiceOptions> = {
    /* define your service-specific options here */
};
