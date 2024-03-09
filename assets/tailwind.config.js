// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

const fs = require("fs")
const path = require("path")
const svgo = require("svgo")
const plugin = require("tailwindcss/plugin")

module.exports = {
  content: [
    "./js/**/*.js",
    "../lib/elixir_list_web.ex",
    "../lib/elixir_list_web/**/*.*ex"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#FD4F00"
      }
    }
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),

    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({ addVariant }) =>
      addVariant("phx-no-feedback", [".phx-no-feedback&", ".phx-no-feedback &"])
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-click-loading", [
        ".phx-click-loading&",
        ".phx-click-loading &"
      ])
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-submit-loading", [
        ".phx-submit-loading&",
        ".phx-submit-loading &"
      ])
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-change-loading", [
        ".phx-change-loading&",
        ".phx-change-loading &"
      ])
    ),

    // Embeds Lucide icons (https://lucide.dev/) into your common.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({ matchComponents }) {
      const iconsDir = path.join(
        __dirname,
        "../node_modules/lucide-static/icons"
      )

      let values = {}

      fs.readdirSync(iconsDir).map((file) => {
        if (path.extname(file) == ".svg") {
          const name = path.basename(file, ".svg")
          const fullPath = path.join(iconsDir, file)

          values[`${name}-xlight`] = { name, fullPath, strokeWidth: "1.4px" }
          values[`${name}-light`] = { name, fullPath, strokeWidth: "1.7px" }
          values[name] = { name, fullPath, strokeWidth: "2px" }
        }
      })

      matchComponents(
        {
          lucide: ({ name, fullPath, strokeWidth }) => {
            const content = fs.readFileSync(fullPath).toString()

            const result = svgo.optimize(content, {
              multipass: true,
              plugins: [
                {
                  name: "removeAttrs",
                  params: {
                    attrs: "svg:(width|height|stroke-width)"
                  }
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [`stroke-width="${strokeWidth}"`]
                  }
                }
              ]
            })

            const markup = result.data

            return {
              [`--lucide-${name}`]: `url('data:image/svg+xml;utf8,${markup}')`,
              "-webkit-mask": `var(--lucide-${name})`,
              "mask": `var(--lucide-${name})`,
              "mask-repeat": "no-repeat",
              "background-color": "currentColor",
              "display": "inline-block",
              "width": "24px",
              "height": "24px"
            }
          }
        },
        { values }
      )
    })
  ]
}
