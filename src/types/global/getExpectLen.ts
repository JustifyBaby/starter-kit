import z from "zod";

export const getExpectLenBySchema = (Schema: z.ZodObject) =>
  Object.keys(Schema.def.shape).length;

export const getDOMLen = (tagName: keyof HTMLElementTagNameMap) => {
  if (!document) {
    console.log("Document is not defined, please use 'happy-dom'!!");
    return null;
  }
  return document.querySelectorAll(tagName).length;
};
