import { createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";

export const mapper = createMapper({
    strategyInitializer: classes(),
});
