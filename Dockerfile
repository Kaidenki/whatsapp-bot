FROM quay.io/cipher/alpha
RUN git clone https://github.com/Primi373-creator/inrl-bot-md /Alpha
WORKDIR /Alpha/
RUN npm install
EXPOSE 3067
CMD ["npm", "start"]
