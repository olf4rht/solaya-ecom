import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: "Used in product grids and thumbnails",
    }),
    defineField({
      name: "plyFile",
      title: "3D Model (.ply)",
      type: "r2File",
      description: "Gaussian Splat .ply file — uploaded to R2",
    }),
    defineField({
      name: "media",
      title: "Media Gallery",
      type: "array",
      description: "Images and videos for the product page. The 3D model is automatically included.",
      of: [
        { type: "image", options: { hotspot: true } },
        {
          type: "r2File",
          title: "Video (R2)",
        },
      ],
    }),
    defineField({
      name: "scans",
      title: "Number of Scans",
      type: "number",
      initialValue: 5,
    }),
    defineField({
      name: "hasIntegrations",
      title: "Integrations Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "hasExtensions",
      title: "Extensions Included",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "commercialUsage",
      title: "Commercial Usage Available",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "brand", media: "coverImage" },
  },
});
