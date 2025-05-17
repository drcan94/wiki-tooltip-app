import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: "strip-where-selectors",
      enforce: "post",
      transform(code, id) {
        if (id.endsWith(".css")) {
          return code.replace(/:where\((.+?)\)/g, "$1");
        }
        return code;
      },
      async generateBundle(_, bundle) {
        for (const [key, asset] of Object.entries(bundle)) {
          if (asset.type === "asset" && key.endsWith(".css")) {
            asset.source = asset.source
              .toString()
              .replace(/:where\((.+?)\)/g, "$1");
          }
        }
      },
    },
  ],
});
