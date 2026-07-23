%LICENSE_HEADER
import './env-defaults.js';
import logger from '@imqueue/async-logger';
import { type IMQServiceOptions, UDPClusterManager } from '@imqueue/rpc';
import { z } from 'zod';

try {
    // native .env support; throws when no .env file exists
    process.loadEnvFile();
} catch {
    /* no .env file - rely on the process environment */
}

const boolFlag = (defaultValue = false) =>
    z.coerce
        .number()
        .int()
        .default(defaultValue ? 1 : 0)
        .transform(n => n !== 0);

const positiveInt = (defaultValue: number) =>
    z.coerce.number().int().positive().default(defaultValue);

/**
 * Environment schema. Declare every service-specific variable here so
 * configuration is validated once, at start-up, with clear errors. Add-ons
 * contribute their own variables at the %ADDON marker below.
 */
const EnvSchema = z.object({
    SERVICE_NAME: z.string().default('%SERVICE_NAME'),

    /* @imqueue transport (Redis) */
    IMQ_USERNAME: z.string().optional(),
    IMQ_PASSWORD: z.string().optional(),
    IMQ_CLUSTER: z.string().default('localhost:6379'),
    IMQ_CLUSTER_MANAGER_DISABLED: boolFlag(false),
    IMQ_LOG_TIME: boolFlag(true),
    IMQ_LOG_TIME_FORMAT: z.string().default('milliseconds'),
    IMQ_SAFE_DELIVERY: boolFlag(false),
    IMQ_SAFE_DELIVERY_TTL: z.coerce.number().int().default(5000),
    IMQ_USE_GZIP: boolFlag(false),
    IMQ_MULTI_PROCESS: boolFlag(false),
    IMQ_CHILDREN_PER_CORE: positiveInt(1),
    IMQ_VERBOSE: boolFlag(false),
    IMQ_VERBOSE_EXTENDED: boolFlag(false),

    /* Optional Redis-backed cache */
    IMQ_CACHE_HOST: z.string().optional(),
    IMQ_CACHE_PORT: z.coerce.number().int().nonnegative().default(0),
    IMQ_CACHE_USERNAME: z.string().optional(),
    IMQ_CACHE_PASSWORD: z.string().optional(),
    IMQ_CACHE_MAX_TTL: positiveInt(900000),

    QUEUE_LENGTH_METRIC_ENABLED: boolFlag(false),
    DEPLOYMENT_NAME: z.string().default(''),
    DEPLOYMENT_ENV: z.string().default(''),
});
%ADDON_CONFIG
type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
    const parsed = EnvSchema.safeParse(process.env);

    if (!parsed.success) {
        logger.error(
            'Invalid environment configuration:',
            JSON.stringify(z.treeifyError(parsed.error), null, 2),
        );
        process.exit(1);
    }

    return parsed.data;
}

function buildImqOptions(env: Env): Partial<IMQServiceOptions> {
    const options: Partial<IMQServiceOptions> = {
        logger,
        safeDelivery: env.IMQ_SAFE_DELIVERY,
        safeDeliveryTtl: env.IMQ_SAFE_DELIVERY_TTL,
        useGzip: env.IMQ_USE_GZIP,
        multiProcess: env.IMQ_MULTI_PROCESS,
        childrenPerCore: env.IMQ_CHILDREN_PER_CORE,
        username: env.IMQ_USERNAME,
        password: env.IMQ_PASSWORD,
        verbose: env.IMQ_VERBOSE,
        verboseExtended: env.IMQ_VERBOSE_EXTENDED,
        metricsServer: {
            enabled: env.QUEUE_LENGTH_METRIC_ENABLED,
            queueLengthFormatter: (length, metricName) =>
                `${metricName}{service="${env.DEPLOYMENT_NAME}",namespace="${
                    env.DEPLOYMENT_ENV
                }"} ${length}`,
        },
    };

    if (env.IMQ_CLUSTER_MANAGER_DISABLED) {
        options.cluster = env.IMQ_CLUSTER.split(/\s*,\s*/).map(entry => {
            const [host = 'localhost', port = '6379'] = entry.split(/\s*:\s*/);

            return { host, port: +port };
        });

        return options;
    }

    options.clusterManagers = [new UDPClusterManager()];

    return options;
}

function buildConfig(env: Env) {
    return {
        serviceName: env.SERVICE_NAME,
        logger,
        cache: {
            host: env.IMQ_CACHE_HOST,
            port: env.IMQ_CACHE_PORT,
            username: env.IMQ_CACHE_USERNAME,
            password: env.IMQ_CACHE_PASSWORD,
            maxTtl: env.IMQ_CACHE_MAX_TTL,
        },
        imq: buildImqOptions(env),
    };
}

export const config = buildConfig(loadEnv());
export const serviceOptions: Partial<IMQServiceOptions> = config.imq;
