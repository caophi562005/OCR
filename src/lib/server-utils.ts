import https from "https";

export const convertUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      https
        .get(
          url,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
              Accept: "image/*",
            },
          },
          (res) => {
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`Failed to fetch image: ${res.statusCode}`));
              res.resume();
              return;
            }
            const data: Uint8Array[] = [];
            res.on("data", (chunk) => data.push(chunk));
            res.on("end", () => resolve(Buffer.concat(data)));
          }
        )
        .on("error", reject);
    });

    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw new Error("Failed to download image");
  }
};
