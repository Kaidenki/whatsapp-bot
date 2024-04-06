FROM quay.io/cipher/alpha
RUN git clone https://github.com/C-iph3r/alpha-md/ /Alpha
WORKDIR /Alpha/
RUN npm install
EXPOSE 3067
CMD ["npm", "start"]
