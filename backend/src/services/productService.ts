import ImageQueue from "../jobs/queues/ImageQueue";
import { cacheQueue } from "../jobs/queues/cacheQueue";
import { createProduct, getProductsList } from "../models/productRepository";
import { createError } from "../utils/error";
import { errorCode } from "../config";
import { getOrSetCache } from "../utils/cache";

type ProductProps = {
  name: string;
  description: string;
  price: number;
  discount: number;
  inventory: number;
  category: string;
  type: string;
  tags: string;
  files: any;
};

export const productCreateService = async (product: ProductProps) => {
  const {
    name,
    description,
    price,
    discount,
    inventory,
    category,
    type,
    tags,
    files,
  } = product;

  // Optimize file
  // await Promise.all(
  //   files.map(async (file: any) => {
  //     // console.log("Uploaded file:", file.filename);
  //     const splitFileName = file.filename.split(".")[0];
  //     const optimizeFilePath = path.join(
  //       __dirname,
  //       "../../..",
  //       "/uploads/optimize/" + splitFileName + ".webp"
  //     );

  //     try {
  //       return await sharp(file.path)
  //         .resize(835, 577)
  //         .webp({ quality: 80 })
  //         .toFile(optimizeFilePath);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })
  // );

  // Optimize file
  await Promise.all(
    files.map(async (file: any) => {
      // console.log("Uploaded file:", file.filename);
      const splitFileName = file.filename.split(".")[0];
      return ImageQueue.add(
        "optimize-image",
        {
          filePath: file.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 100,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        }
      );
    })
  );

  const originalFileNames = files.map((file: any) => ({
    url: file.filename,
  }));

  const data: any = {
    name,
    description,
    price,
    discount,
    inventory: +inventory,
    category,
    type,
    tags,
    images: originalFileNames,
  };
  let newProduct;
  try {
    newProduct = await createProduct(data);
  } catch (error) {
    throw createError("Cannot create a new post.", 500, errorCode.serverError);
  }

  await cacheQueue.add(
    "invalidate-product-cache",
    {
      pattern: "products:*",
    },
    {
      jobId: `invalidate-${Date.now()}`,
      priority: 1,
    }
  );

  return newProduct.id;
};

type GetProductProps = {
  lastCursor?: number;
  limit: number;
  category?: string;
  type?: string;
  query: any;
};

export const getProductsService = async (params: GetProductProps) => {
  const { lastCursor, limit, category, type, query } = params;

  let categoryList: number[] = [];
  let typeList: number[] = [];

  if (category) {
    categoryList = category
      .split(",")
      .map((c) => Number(c))
      .filter((c) => c > 0);
  }

  if (type) {
    typeList = type
      .split(",")
      .map((t) => Number(t))
      .filter((t) => t > 0);
  }

  // console.log("categoryList -----", categoryList);

  const where = {
    AND: [
      categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
      typeList.length > 0 ? { typeId: { in: typeList } } : {},
    ],
  };

  const options = {
    where,
    take: limit + 1,
    skip: lastCursor ? 1 : 0,
    cursor: lastCursor ? { id: lastCursor } : undefined,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      discount: true,
      status: true,
      images: {
        select: {
          id: true,
          url: true,
        },
        take: 1, // Limit to the first image
      },
    },
    orderBy: {
      id: "desc",
    },
  };

  const cacheKey = `products:${JSON.stringify(query)}`;
  const products = await getOrSetCache(cacheKey, async () => {
    return await getProductsList(options);
  });

  const hasNextPage = products.length > +limit;

  if (hasNextPage) {
    products.pop();
  }

  const nextCursor =
    products.length > 0 ? products[products.length - 1].id : null;

  return { hasNextPage, nextCursor, prevCursor: lastCursor, products };
};
