FROM node:7.10.0
RUN useradd --user-group --create-home --shell /bin/false app && npm -g i @angular/cli@latest
ENV HOME=/home/app

COPY package.json \
     .angular-cli.json \
     CHANGELOG.md \
     README.md \
     tsconfig.json \
     tslint.json \
     karma.conf.js $HOME/angular-material-demo/
     
COPY src/ $HOME/angular-material-demo/src/

RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/angular-material-demo
RUN npm install