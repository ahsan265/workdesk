FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN npm i @angular/cli -g

RUN npm config set @gigaaa:registry https://gitlab.gigaaa.link/api/v4/projects/59/packages/npm/
RUN npm config set -- '//gitlab.gigaaa.link/api/v4/projects/59/packages/npm/:_authToken' "glpat-tEA5zyhJMmCUk3XcXezg"
RUN npm ci

RUN ng run gigaaa-developer-platform:ngsscbuild:production

### STAGE 2: Run ###
FROM nginx:1.21-alpine

# Install ngssc binary
ADD https://github.com/kyubisation/angular-server-side-configuration/releases/download/v15.0.2/ngssc_64bit /usr/sbin/ngssc
RUN chmod +x /usr/sbin/ngssc

# Add ngssc init script
COPY ngssc.sh /docker-entrypoint.d/ngssc.sh
RUN chmod +x /docker-entrypoint.d/ngssc.sh

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/gigaaa-developer-platform /usr/share/nginx/html
