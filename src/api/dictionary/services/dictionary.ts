/**
 * dictionary service
 */

import {factories} from '@strapi/strapi';
import {getWords} from "../functions/getRandomWords";

export default factories.createCoreService('api::dictionary.dictionary', ({strapi}) => ({
  async addWord(wordObject, userId: number) {
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
  async deleteWord(wordId: number, userId: number) {
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
  async getDictionary(userId: number) {
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
  async getTest(userId: number) {
    let test = await strapi.db.query("api::test.test").findOne({
      where: {user_id: userId, isActive: true},
      populate: true,
    })
    if (test) {
      return test
    }
    const dictionary = await strapi.db.query("api::dictionary.dictionary").findOne({
      where: {user_id: userId},
      populate: true,
    })
    const words = dictionary.word;
    if (words.length < 5) {
      return {
        error: true,
        message: "You need to add at least 5 words to the dictionary"
      }
    }
    const randomWords = getWords(words, 5);
    await strapi.entityService.create('api::test.test', {
      data: {
        user_id: userId,
        words: randomWords,
        isActive: true
      }
    })
    return await strapi.db.query("api::test.test").findOne({
      where: {user_id: userId, isActive: true},
      populate: true,
    })
  },
  async endTest(userId: number) {
    let test = await strapi.db.query("api::test.test").findOne({
      where: {user_id: userId, isActive: true},
      populate: true,
    })

    await strapi.entityService.update("api::test.test", test.id, {
      data: {isActive: false}
    })
    return  await strapi.db.query("api::test.test").findOne({
      where: {user_id: userId, isActive: true},
      populate: true,
    })
  }
}));
