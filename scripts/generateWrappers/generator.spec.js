import fs from "fs-extra";
import { readFileSync } from "fs";
import path from "path";
import { TemplateToken } from "./templates/templates";
import { generateWrappersV3 } from "./generator";

const MOCK_DATA = {
  schemaVersion: "1.0.0",
  readme: "",
  modules: [
    {
      kind: "javascript-module",
      path: "path/to/module",
      declarations: [
        {
          kind: "variable",
          name: "variable1",
          type: {
            text: "{\n\t/**\n\t * Description 1.\n\t */\n\tvalue1: 'value1',\n\n\t/**\n\t * Description 2.\n\t */\n\tvalue2: 'value2',\n}",
          },
          default:
            "{\n\t/**\n\t * Description 1.\n\t */\n\tvalue1: 'value1',\n\n\t/**\n\t * Description 2.\n\t */\n\tvalue2: 'value2',\n}",
          description: "variable1 description",
          privacy: "public",
        },
        {
          kind: "class",
          description: "",
          name: "Class1",
          slots: [
            {
              description: "Default slot.",
              name: "",
            },
          ],
          members: [
            {
              kind: "field",
              name: "field1",
              type: {
                text: "AccordionExpandMode",
              },
              description: "Field1Description",
              privacy: "public",
            },
            {
              kind: "field",
              name: "field2",
              type: {
                text: "string | null",
              },
            },
            {
              kind: "field",
              name: "activeItemIndex",
              type: {
                text: "number",
              },
              default: "0",
            },
            {
              kind: "method",
              name: "method1",
              return: {
                type: {
                  text: "Array | null",
                },
              },
            },
            {
              kind: "method",
              name: "method2",
              return: {
                type: {
                  text: "void",
                },
              },
              parameters: [
                {
                  name: "item",
                  type: {
                    text: "number",
                  },
                },
              ],
            },
          ],
          events: [
            {
              type: {
                text: "CustomEvent<string | null>",
              },
              description:
                "Fires a custom 'change' event when the active item changes",
              name: "change",
            },
          ],
          attributes: [
            {
              name: "field-one",
              type: {
                text: "AccordionExpandMode",
              },
              description: "Attribute1Description",
              fieldName: "field1",
            },
          ],
          superclass: {
            name: "VividElement",
            module:
              "/libs/components/src/shared/foundation/vivid-element/vivid-element",
          },
          vividComponent: {
            public: true,
            name: "accordion",
          },
        },
      ],
      exports: [
        {
          kind: "js",
          name: "AccordionExpandMode",
          declaration: {
            name: "AccordionExpandMode",
            module: "libs/components/src/lib/accordion/accordion.ts",
          },
        },
        {
          kind: "js",
          name: "Class1",
          declaration: {
            name: "Class1",
            module: "libs/components/src/lib/accordion/accordion.ts",
          },
        },
      ],
    },
  ],
};

jest.mock("mkdirp", () => {
  return {
    sync: jest.fn(),
  };
});

jest.mock("fs-extra", () => ({
  outputFile: jest.fn(),
  outputJson: jest.fn(),
}));

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(false),
}));

jest.mock("./templates/templates", () => {
  const actualTemplates = jest.requireActual("./templates/templates");
  return {
    ...actualTemplates,
    getTemplate: jest.fn().mockReturnValue(""),
  };
});

describe("generator", () => {
  beforeEach(() => {
    fs.outputFile.mockReset();
    jest.spyOn(console, "info").mockImplementation(jest.fn());
  });

  afterEach(() => {});

  describe("generateWrappersV3", () => {
    function setTokenTemplateMock(templateToken) {
      jest
        .spyOn(require("./templates/templates"), "getTemplate")
        .mockReturnValueOnce(templateToken);
    }
    const generateWrappersV3InstanceJS = generateWrappersV3();
    const generateWrappersV3InstanceTS = generateWrappersV3("", "ts");

    it("should throw if meta is not supplied", async () => {
      await expect(generateWrappersV3InstanceJS()).rejects.toThrow();
      await expect(generateWrappersV3InstanceTS()).rejects.toThrow();
    });

    it("should output a file with the className inside the v3 directory", async () => {
      readFileSync.mockReturnValue(JSON.stringify(MOCK_DATA));
      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });
      expect(fs.outputFile).toHaveBeenCalledWith(
        path.resolve(process.cwd(), "v3/VwcClass1/index.tsx"),
        expect.any(String)
      );
    });

    it("should replace TemplateToken.CLASS_JSDOC with JSDOC content", async () => {
      setTokenTemplateMock(TemplateToken.CLASS_JSDOC);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchSnapshot();
    });

    it("should replace TemplateToken.ATTRIBUTES with empty string", async () => {
      setTokenTemplateMock(TemplateToken.ATTRIBUTES);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("");
    });

    it("should replace TemplateToken.PROP_TYPES with empty string", async () => {
      setTokenTemplateMock(TemplateToken.PROP_TYPES);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("");
    });

    it("should replace TemplateToken.PROPS with empty string", async () => {
      setTokenTemplateMock(TemplateToken.PROPS);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchInlineSnapshot(`
        "  onChange?: (event: SyntheticEvent) => void,
          \\"field1\\"?: any /* AccordionExpandMode */,
          \\"field2\\"?: string | null,
          \\"activeItemIndex\\"?: number"
      `);
    });

    it("should replace TemplateToken.TAG_DESCRIPTOR_JSON with empty string", async () => {
      setTokenTemplateMock(TemplateToken.TAG_DESCRIPTOR_JSON);
      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchSnapshot();
    });

    it("should replace TemplateToken.COMPONENT_CLASS_NAME with empty string", async () => {
      setTokenTemplateMock(TemplateToken.COMPONENT_CLASS_NAME);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("VwcClass1");
    });

    it("should replace TemplateToken.TAG_PREFIX with empty string", async () => {
      setTokenTemplateMock(TemplateToken.TAG_PREFIX);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("vvd3");
    });

    it("should replace TemplateToken.COMPONENT_NAME with empty string", async () => {
      setTokenTemplateMock(TemplateToken.COMPONENT_NAME);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("Class1");
    });

    it("should replace TemplateToken.TAG with empty string", async () => {
      setTokenTemplateMock(TemplateToken.TAG);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("vvd3-class1");
    });

    it("should replace TemplateToken.EVENTS with empty string", async () => {
      setTokenTemplateMock(TemplateToken.EVENTS);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(JSON.parse(content)).toEqual({
        name: "change",
        propName: "onChange",
      });
    });

    it("should replace TemplateToken.PROPERTIES with comma separated list of fields", async () => {
      setTokenTemplateMock(TemplateToken.PROPERTIES);

      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toEqual("'field1', 'field2', 'activeItemIndex'");
    });

    it("should replace TemplateToken.PROPS and remove duplicate values", async () => {
      function pushAnotherFieldWithExistingFieldName() {
        const newData = JSON.parse(JSON.stringify(MOCK_DATA));
        newData.modules[0].declarations[1].members.push({
          kind: "field",
          name: "field1",
          type: {
            text: "AccordionExpandMode",
          },
          description: "Field1Description",
          privacy: "public",
        });
        return newData;
      }

      setTokenTemplateMock(TemplateToken.PROPS);
      const newData = pushAnotherFieldWithExistingFieldName();

      await generateWrappersV3InstanceTS({ elements: newData });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchInlineSnapshot(`
        "  onChange?: (event: SyntheticEvent) => void,
          \\"field1\\"?: any /* AccordionExpandMode */,
          \\"field2\\"?: string | null,
          \\"activeItemIndex\\"?: number"
      `);
    });

    it("should add extra props from Vivid3ComponentsExtraPropertiesMap", async () => {
      function replaceComponentWithOverridable() {
        const newData = JSON.parse(JSON.stringify(MOCK_DATA));
        newData.modules[0].declarations[1].name = 'DataGridCell'
        return newData;
      }
      setTokenTemplateMock(TemplateToken.PROPS);
      const newData = replaceComponentWithOverridable();

      await generateWrappersV3InstanceTS({ elements: newData });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchInlineSnapshot(`
        "  onChange?: (event: SyntheticEvent) => void,
          \\"ariaSelected\\"?: any /* boolean | undefined */,
          \\"field1\\"?: any /* AccordionExpandMode */,
          \\"field2\\"?: string | null,
          \\"activeItemIndex\\"?: number"
      `);
    });
 
    it("should override default props with extra props from Vivid3ComponentsExtraPropertiesMap", async () => {
      function replaceComponentWithOverridable() {
        const newData = JSON.parse(JSON.stringify(MOCK_DATA));
        newData.modules[0].declarations[1].name = 'DataGridCell'
        newData.modules[0].declarations[1].members[0].name = 'ariaSelected'
        newData.modules[0].declarations[1].attributes[0].name = 'ariaSelected'
        return newData;
      }
      setTokenTemplateMock(TemplateToken.PROPS);
      const newData = replaceComponentWithOverridable();

      await generateWrappersV3InstanceTS({ elements: newData });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content).toMatchInlineSnapshot(`
        "  onChange?: (event: SyntheticEvent) => void,
          \\"ariaSelected\\"?: any /* boolean | undefined */,
          \\"field2\\"?: string | null,
          \\"activeItemIndex\\"?: number"
      `);
    });

    it("should replace component registration for DataGridRow with empty string", async () => {
      setTokenTemplateMock(`
            import { register<% component-name %> } from '@vonage/vivid'

            register<% component-name %>('<% tag-prefix %>')
            `);

      MOCK_DATA.modules[0].declarations.find((x) => x.kind === "class").name =
        "DataGridRow";
      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content.trim()).toBe("");
    });

    it("should replace component registration for DataGridCell with empty string", async () => {
      setTokenTemplateMock(`
            import { register<% component-name %> } from '@vonage/vivid'

            register<% component-name %>('<% tag-prefix %>')
            `);

      MOCK_DATA.modules[0].declarations.find((x) => x.kind === "class").name =
        "DataGridCell";
      await generateWrappersV3InstanceTS({ elements: MOCK_DATA });

      const content = fs.outputFile.mock.calls[0][1];
      expect(content.trim()).toBe("");
    });
  });
});
