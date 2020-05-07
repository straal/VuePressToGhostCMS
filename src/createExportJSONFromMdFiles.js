const fs = require("fs-extra");
const yaml = require("js-yaml");
const showdown = require("showdown");
const ObjectId = require("bson-objectid");
const converter = require('@tryghost/html-to-mobiledoc')

const { from } = require("rxjs");
const {
  filter,
  map,
  mergeMap,
  mergeAll,
  tap,
  reduce,
} = require("rxjs/operators");

const L = require("lodash");

const MARKDOWNS_DIRECTORY_PATH = "example"

const showdownConverter = new showdown.Converter({
  ghCompatibleHeaderId: true,
});

const getGhostDataFromFile = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  console.time(`Get data from file ${filePath} in`);
  const fileContent = fileBuffer.toString("utf8");

  const [_, yamlPost, markdownContent] = fileContent.split("---\n");

  const jsonPost = yaml.load(yamlPost);

  const htmlContent = showdownConverter
    .makeHtml(markdownContent)
    .replace(/\r?\n|\r/g, "")

  const tags = jsonPost.tags;
  delete jsonPost.tags;

  const authors = jsonPost.authors;
  delete jsonPost.authors;

  jsonPost.author_id = jsonPost.primary_author
    ? jsonPost.primary_author.id
    : null;
  delete jsonPost.primary_author;
  delete jsonPost.primary_tag;

  const postsAuthors = (authors || []).map((author) => ({
    id: ObjectId.generate(),
    post_id: jsonPost.id,
    author_id: author.id,
    sort_order: 0,
  }));

  const postsTags = (tags || []).map((tag) => ({
    id: ObjectId.generate(),
    post_id: jsonPost.id,
    tag_id: tag.id,
    sort_order: 0,
  }));

  const mobiledoc = converter.toMobiledoc(htmlContent)

  const post = {
    ...jsonPost,
    html: htmlContent,
    mobiledoc: JSON.stringify(mobiledoc),
  };

  const data = {
    posts: [post],
    tags,
    posts_authors: postsAuthors,
    posts_tags: postsTags,
  };
  console.timeEnd(`Get data from file ${filePath} in`);

  return data;
};

const markdownComparator = (fileName) => fileName.endsWith("md");

const directoryInjector = L.curry((directory, fileName) => `${directory}/${fileName}`);

const hasIdComparator = (postData) => L.has(L.head(postData.posts), 'id');

const concatUniq = (collection, data, path) =>
  L.set(
    collection,
    path,
    L.uniqBy(L.concat(L.get(collection, path), L.get(data, path)), "id")
  );

const allPostsReducer = (allData, postData) => {
  concatUniq(allData, postData, "posts");
  concatUniq(allData, postData, "tags");
  concatUniq(allData, postData, "posts_authors");
  concatUniq(allData, postData, "posts_tags");
  return allData;
};

const allPostsAccumulator = {
  posts: [],
  tags: [],
  posts_authors: [],
  posts_tags: [],
};

const exportJsonMapper = (allData) => ({
  db: [
    {
      meta: {
        exported_on: Date.now(),
        version: "3.12.1",
      },
      data: allData,
    },
  ],
});

const saveExportJsonToFile = (exportJson) =>
  fs.writeFile(
    "export.json",
    JSON.stringify(exportJson, null, 2)
  );

const createExportJSONFromMdFiles = async function () {
  console.info("Start generating file to import ghost file");
  await from(fs.readdir(MARKDOWNS_DIRECTORY_PATH))
    .pipe(
      tap(() => console.time("Export file saved in")),
      mergeAll(),
      filter(markdownComparator),
      map(directoryInjector(MARKDOWNS_DIRECTORY_PATH)),
      mergeMap(getGhostDataFromFile),
      filter(hasIdComparator),
      reduce(allPostsReducer, allPostsAccumulator),
      map(exportJsonMapper),
      mergeMap(saveExportJsonToFile),
      tap(() => console.timeEnd("Export file saved in"))
    )
    .toPromise();
};

createExportJSONFromMdFiles()
