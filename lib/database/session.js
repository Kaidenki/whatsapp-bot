const { Curve, signedKeyPair } = require("@whiskeysockets/baileys/lib/Utils/crypto");
const { generateRegistrationId } = require("@whiskeysockets/baileys/lib/Utils/generics");
const { randomBytes } = require("crypto");
const { Sequelize, DataTypes } = require('sequelize');
const config = require("../../config");

const AuthState = config.DATABASE.define('AuthState', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSONB,
  },
});

const initAuthCreds = () => {
  const identityKey = Curve.generateKeyPair();
  return {
    noiseKey: Curve.generateKeyPair(),
    signedIdentityKey: identityKey,
    signedPreKey: signedKeyPair(identityKey, 1),
    registrationId: generateRegistrationId(),
    advSecretKey: randomBytes(32).toString("base64"),
    processedHistoryMessages: [],
    nextPreKeyId: 1,
    firstUnuploadedPreKeyId: 1,
    accountSettings: {
      unarchiveChats: false,
    },
  };
};

const BufferJSON = {
  replacer: (k, value) => {
    if (
      Buffer.isBuffer(value) ||
      value instanceof Uint8Array ||
      value?.type === "Buffer"
    ) {
      return {
        type: "Buffer",
        data: Buffer.from(value?.data || value).toString("base64"),
      };
    }
    return value;
  },
  reviver: (_, value) => {
    if (
      typeof value === "object" &&
      !!value &&
      (value.buffer === true || value.type === "Buffer")
    ) {
      const val = value.data || value.value;
      return typeof val === "string"
        ? Buffer.from(val, "base64")
        : Buffer.from(val || []);
    }
    return value;
  },
};

 const writesession = async (data, id) => {
    const informationToStore = JSON.parse(
      JSON.stringify(data, BufferJSON.replacer)
    );
    await AuthState.upsert({ id, data: informationToStore });
  };

const PgAuthState = async () => {
  const writeData = async (data, id) => {
    const informationToStore = JSON.parse(
      JSON.stringify(data, BufferJSON.replacer)
    );
    await AuthState.upsert({ id, data: informationToStore });
  };
  
  const readData = async (id) => {
    try {
      const result = await AuthState.findOne({ where: { id } });
      if (result) {
        const data = JSON.stringify(result.data);
        return JSON.parse(data, BufferJSON.reviver);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const removeData = async (id) => {
    try {
      await AuthState.destroy({ where: { id } });
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  const creds = (await readData(sessionId)) || initAuthCreds();
  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === "app-state-sync-key") {
                value = proto.Message.AppStateSyncKeyData.fromObject(data);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks = [];
          for (const category of Object.keys(data)) {
            for (const id of Object.keys(data[category])) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              tasks.push(value ? writeData(value, key) : removeData(key));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => writeData(creds, sessionId),
  };
};

module.exports = { PgAuthState, writesession };
