FROM node:%NODE_DOCKER_TAG-alpine

WORKDIR /app

RUN apk add --no-cache dbus

# Install production dependencies against the committed lockfile.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy the pre-built deploy bundle produced by `npm run build:bundle`
# (in CI this is the artifact built and verified by the build job).
COPY build/ ./

# Seed a stable machine id so the entrypoint can rewrite it at start-up.
RUN MACHINE_UID="$(dbus-uuidgen)" \
    && echo "$MACHINE_UID" > /etc/machine-id \
    && echo "$MACHINE_UID" > /var/lib/dbus/machine-id \
    && chmod ugo+rw /etc/machine-id /var/lib/dbus/machine-id

ENV NODE_ENV=production

EXPOSE 9090

USER node

ENTRYPOINT ["sh", "bin/entrypoint.sh"]
