FROM node:18-alpine AS build

WORKDIR /usr/src/app

RUN npm i @angular/cli -g

RUN npm config set @gigaaa:registry https://gitlab.exafy.io/api/v4/projects/59/packages/npm/
RUN npm config set -- '//gitlab.exafy.io/api/v4/projects/59/packages/npm/:_authToken' "glpat-SPS2fqh91xu6cBM9EAPE"

COPY . .

RUN npm i

RUN ng build

### STAGE 2: Run ###
FROM nginx:1.21-alpine

# Install ngssc binary
ADD https://github.com/kyubisation/angular-server-side-configuration/releases/download/v15.0.2/ngssc_64bit /usr/sbin/ngssc
RUN chmod +x /usr/sbin/ngssc

# Add ngssc init script
COPY ngssc.sh /docker-entrypoint.d/ngssc.sh
RUN chmod +x /docker-entrypoint.d/ngssc.sh

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/workdesk /usr/share/nginx/html
