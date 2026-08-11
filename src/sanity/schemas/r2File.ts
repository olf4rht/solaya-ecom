import { defineType } from "sanity";

export const r2File = defineType({
  name: "r2File",
  title: "R2 File",
  type: "object",
  fields: [
    {
      name: "url",
      title: "File URL",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileName",
      title: "File Name",
      type: "string",
      readOnly: true,
    },
    {
      name: "fileSize",
      title: "File Size (bytes)",
      type: "number",
      readOnly: true,
    },
    {
      name: "contentType",
      title: "Content Type",
      type: "string",
      readOnly: true,
    },
  ],
});
