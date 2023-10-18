/**
 * dictionary service
 */

import {factories} from '@strapi/strapi';
import {getRandomWords} from "../functions/getRandomWords";

export default factories.createCoreService('api::dictionary.dictionary', ({strapi}) => ({
  async addWord(wordObject, userId) {
    let dictionary = await strapi.db.query("api::dictionary.dictionary").findOne({
      where: {user_id: userId},
      populate: true,
    })

    if (!dictionary) {
      dictionary = await strapi.entityService.create('api::dictionary.dictionary', {
        data: {
          user_id: userId,
          words: []
        }
      })
    }
    if (!dictionary.word) {
      dictionary.word = [];
    }

    dictionary.word.push(wordObject)

    await strapi.entityService.update('api::dictionary.dictionary', dictionary.id, {
      data: {
        word: dictionary.word
      }
    });

    return dictionary;
  },
  async deleteWord(wordId, userId) {
    let dictionary = await strapi.db.query("api::dictionary.dictionary").findOne({
      where: {user_id: userId},
      populate: true,
    });
    console.log(dictionary)
    dictionary.word = dictionary.word.filter(word => word.id !== wordId
    );
    console.log(dictionary.word)
    await strapi.entityService.update('api::dictionary.dictionary', dictionary.id, {
      data: {
        word: dictionary.word
      }
    });
    console.log(dictionary)

    return dictionary;
  },
  async getDictionary(userId) {
    let dictionary = await strapi.db.query("api::dictionary.dictionary").findOne({
      where: {user_id: userId},
      populate: true,
    })

    if (!dictionary) {
      dictionary = await strapi.entityService.create('api::dictionary.dictionary', {
        data: {
          user_id: userId,
          words: []
        }
      })
    }
    return dictionary;
  },
  async getRandomTest(userId: number) {
    const dictionary = await strapi.db.query("api::dictionary.dictionary").findOne({
      where: {user_id: userId},
      populate: true,
    })
    const words = dictionary.word;
    return getRandomWords(words, 5);
  }
}));
