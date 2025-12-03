FROM nginx:alpine

# Remove HTML padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia seus arquivos estáticos para o nginx
COPY . /usr/share/nginx/html

EXPOSE 80
