
FROM nameinan/nginx-angular:2.0

COPY ./dist/workdesk /usr/share/nginx/html

EXPOSE 80
