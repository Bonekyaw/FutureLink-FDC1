export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  categoryId: string;
  discount: number;
  inventory: number;
  status: string;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  page: number;
  totalPages: number;
}

export const productApi = {
  getProducts: async (
    page: number = 1,
    limit: number = 8,
  ): Promise<ProductsResponse> => {
    const mockProducts: Product[] = [
      {
        id: "uuid1",
        name: "Nordic Chair",
        description:
          "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid1",
        price: 230,
        discount: 0,
        rating: 4,
        inventory: 180,
        status: "active",
      },
      {
        id: "uuid2",
        name: "Modern Sofa",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid2",
        price: 899,
        discount: 10,
        rating: 5,
        inventory: 45,
        status: "active",
      },
      {
        id: "uuid3",
        name: "Oak Coffee Table",
        description:
          "Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid3",
        price: 450,
        discount: 0,
        rating: 4,
        inventory: 30,
        status: "active",
      },
      {
        id: "uuid4",
        name: "Velvet Armchair",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid4",
        price: 320,
        discount: 5,
        rating: 4,
        inventory: 25,
        status: "active",
      },
      {
        id: "uuid5",
        name: "Wooden Bed Frame",
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid5",
        price: 750,
        discount: 0,
        rating: 5,
        inventory: 15,
        status: "active",
      },
      {
        id: "uuid6",
        name: "Bookshelf Cabinet",
        description:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid6",
        price: 380,
        discount: 15,
        rating: 4,
        inventory: 60,
        status: "active",
      },
      {
        id: "uuid7",
        name: "Round Dining Table",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid7",
        price: 580,
        discount: 0,
        rating: 5,
        inventory: 20,
        status: "active",
      },
      {
        id: "uuid8",
        name: "Leather Recliner",
        description:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        images: ["/api/placeholder/300/200"],
        categoryId: "uuid8",
        price: 1200,
        discount: 20,
        rating: 5,
        inventory: 10,
        status: "active",
      },
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = mockProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < mockProducts.length;

    return {
      products,
      hasMore,
      page,
      totalPages: Math.ceil(mockProducts.length / limit),
    };
  },
};
