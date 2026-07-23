%LICENSE_HEADER
/**
 * Baseline environment defaults applied before configuration is read. Values
 * already present in the environment always win — these only fill the gaps.
 */
export const IMQ_ENV_DEFAULTS: Record<string, string> = {
    IMQ_LOG_TIME: '1',
    IMQ_LOG_TIME_FORMAT: 'milliseconds',
};

for (const [key, value] of Object.entries(IMQ_ENV_DEFAULTS)) {
    process.env[key] ??= value;
}
