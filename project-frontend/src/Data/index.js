import { faker } from '@faker-js/faker';
import { dateFormat, dateTimeFormat, mysqlDataTypes, timeFormat } from '../helper/constants';
import dayjs from 'dayjs';

function getRandomDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dayjs(date).format(dateFormat);
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return dayjs().hour(hours).minute(minutes).second(seconds).format(timeFormat);
}

function getRandomDateTime() {
  const start = new Date(2020, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dayjs(date).format(dateTimeFormat);
}

function getRndCFV(type) {
  switch (type) {
    case 'INT':
      return Math.round(Math.random() * 12548);
    case 'FLOAT':
      return Math.random() * 12548;
    case 'TEXT':
      return faker.lorem.paragraph(10);
    case 'VARCHAR':
      return faker.string.alphanumeric();
    case 'DATE':
      return getRandomDate();
    case 'TIME':
      return getRandomTime();
    case 'DATETIME':
      return getRandomDateTime();
    case 'BOOLEAN':
      return Math.random() <= 0.5;
    default:
      return null;
  }
}

function generateItem(cf, cid, collectionName) {
  return {
    id: faker.number.int(),
    collectionId: cid,
    collectionName: collectionName,
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(2),
    likes: Math.round(Math.random() * 1000),
    images: faker.datatype.boolean() ? Array.from(
      { length: Math.round(Math.random() * 10) },
      () => faker.image.url()
    ) :
      [],
    customFields: cf,
    tags: Array.from({ length: Math.round(Math.random() * 100) }, () => ({ id: faker.number.int(10000000), value: faker.word.preposition() })),
  };
};

function generateField() {
  const rndi = Math.round(Math.random() * (mysqlDataTypes.length - 1));
  const type = mysqlDataTypes[rndi].value;
  return {
    name: faker.word.noun(),
    type: type,
    value: getRndCFV(type),
    isRequired: faker.datatype.boolean(),
  };
}

function generateCollection(itemCount) {
  const id = faker.number.int();
  const name = faker.commerce.department();
  const cf = Array.from({ length: Math.round(Math.random() * itemCount) }, generateField);
  const items = Array.from({ length: Math.round(Math.random() * itemCount) }, () => generateItem(cf, id, name));
  return {
    id: id,
    name: name,
    description: faker.lorem.sentences(3),
    image: faker.image.avatar(),
    items: items,
    customFields: cf,
    category: { id: 1, value: faker.word.interjection() },
    count: items.length,
  };
};

function generateSearchData() {
  const isCollection = faker.datatype.boolean();
  return {
    id: faker.number.int(),
    type: isCollection ? 'collection' : 'item',
    name: faker.commerce.productName(),
    description: isCollection ? faker.lorem.sentences(3) : null,
    image: faker.datatype.boolean() ? faker.image.avatar() : null,
    likes: isCollection ? null : Math.round(Math.random() * 1000),
    tags: isCollection ? null : Array.from({ length: 1 + Math.round(Math.random() * 5) }, () => faker.word.noun()),
    collectionName: isCollection ? null : faker.commerce.productName(),
    userName: isCollection ? faker.internet.userName() : null,
  }
}

export function generateSearchDatas(itemsCount) {
  return Array.from({ length: Math.round(Math.random() * itemsCount) }, () => generateSearchData());
};

export function generateCollections(collectionCount, itemsPerCollection) {
  return Array.from({ length: collectionCount }, () => generateCollection(itemsPerCollection));
};