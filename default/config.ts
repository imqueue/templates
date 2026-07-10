%LICENSE_HEADER
import type { IMQServiceOptions } from '@imqueue/rpc';

try {
    // native .env files support; throws when no .env file exists
    process.loadEnvFile();
} catch {
    /* no .env file - rely on the process environment */
}

/* check environments variables if required to bypass secrets */

export const serviceOptions: Partial<IMQServiceOptions> = {
    /* define your service-specific options here */
};
