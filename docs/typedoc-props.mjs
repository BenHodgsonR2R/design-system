import { Converter } from "typedoc";

// TypeDoc names a destructured parameter `__namedParameters`; every one here is a component's props.
export function load(app) {
  app.converter.on(Converter.EVENT_CREATE_PARAMETER, (_context, parameter) => {
    if (parameter.name === "__namedParameters") {
      parameter.name = "props";
    }
  });
}
