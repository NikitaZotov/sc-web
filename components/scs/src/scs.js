var SCs = SCs || {version: "0.1.0"};

SCs.Connectors = {};
SCs.SCnConnectors = {};
SCs.SCnSortOrder = [,
    'nrel_section_base_order',
    'nrel_main_idtf',
    'nrel_system_identifier',
    'nrel_idtf',
    'nrel_section_decomposition',
    'rrel_key_sc_element',
    'nrel_logo',
    'nrel_location'
];

SCs.SCnBallMarker = '●';

$(document).ready(function () {
    SCs.Connectors[sc.ScType.EdgeCommon] = {f: "<>", b: "<>"};
    SCs.Connectors[sc.ScType.ArcCommon] = {f: ">", b: "<"};
    SCs.Connectors[sc.ScType.ArcAccess] = {f: "..>", b: "<.."};
    SCs.Connectors[sc.ScType.EdgeCommonConst] = {f: "<=>", b: "<=>"};
    SCs.Connectors[sc.ScType.EdgeCommonVar] = {f: "_<=>", b: "_<=>"};
    SCs.Connectors[sc.ScType.ArcCommonConst] = {f: "=>", b: "<="};
    SCs.Connectors[sc.ScType.ArcCommonVar] = {f: "_=>", b: "_<="};
    SCs.Connectors[sc.ScType.ArcAccessConstPosPerm] = {f: "->", b: "<-"};
    SCs.Connectors[sc.ScType.ArcAccessConstNegPerm] = {f: "-|>", b: "<|-"};
    SCs.Connectors[sc.ScType.ArcAccessConstFuzPerm] = {f: "-/>", b: "</-"};
    SCs.Connectors[sc.ScType.ArcAccessConstPosTemp] = {f: "~>", b: "<~"};
    SCs.Connectors[sc.ScType.ArcAccessConstNegTemp] = {f: "~|>", b: "<|~"};
    SCs.Connectors[sc.ScType.ArcAccessConstFuzTemp] = {f: "~/>", b: "</~"};
    SCs.Connectors[sc.ScType.ArcAccessVarPosPerm] = {f: "_->", b: "_<-"};
    SCs.Connectors[sc.ScType.ArcAccessVarNegPerm] = {f: "_-|>", b: "_<|-"};
    SCs.Connectors[sc.ScType.ArcAccessVarFuzPerm] = {f: "_-/>", b: "_</-"};
    SCs.Connectors[sc.ScType.ArcAccessVarPosTemp] = {f: "_~>", b: "_<~"};
    SCs.Connectors[sc.ScType.ArcAccessVarNegTemp] = {f: "_~|>", b: "_<|~"};
    SCs.Connectors[sc.ScType.ArcAccessVarFuzTemp] = {f: "_~/>", b: "_</~"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarPosPerm] = {f: "__->", b: "__<-"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarNegPerm] = {f: "__-|>", b: "__<|-"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarFuzPerm] = {f: "__-/>", b: "__</-"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarPosTemp] = {f: "__~>", b: "__<~"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarNegTemp] = {f: "__~|>", b: "__<|~"};
    SCs.Connectors[sc.ScType.ArcAccessMetaVarFuzTemp] = {f: "__~/>", b: "__</~"};


    SCs.SCnConnectors[sc.ScType.EdgeCommon] = {f: "↔", b: "↔"};
    SCs.SCnConnectors[sc.ScType.ArcCommon] = {f: "→", b: "←"};
    SCs.SCnConnectors[sc.ScType.ArcAccess] = {f: "..∍", b: "∊.."};
    SCs.SCnConnectors[sc.ScType.EdgeCommonConst] = {f: "⇔", b: "⇔"};
    SCs.SCnConnectors[sc.ScType.EdgeCommonVar] = {f: "⇐⇒", b: "⇐⇒"};
    SCs.SCnConnectors[sc.ScType.ArcCommonConst] = {f: "⇒", b: "⇐"};
    SCs.SCnConnectors[sc.ScType.ArcCommonVar] = {f: "_⇒", b: "_⇐"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstPosPerm] = {f: "∍", b: "∊"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstNegPerm] = {f: "∌", b: "∉"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstFuzPerm] = {f: "/∍", b: "∊/"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstPosTemp] = {f: "~∍", b: "∊~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstNegTemp] = {f: "~∌", b: "∉~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessConstFuzTemp] = {f: "~/∍", b: "∊/~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarPosPerm] = {f: "_∍", b: "_∊"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarNegPerm] = {f: "_∌", b: "_∉"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarFuzPerm] = {f: "_/∍", b: "_∊/"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarPosTemp] = {f: "_~∍", b: "_∊~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarNegTemp] = {f: "_~∌", b: "_∉~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessVarFuzTemp] = {f: "_~/∍", b: "_∊/~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarPosPerm] = {f: "__∍", b: "__∊"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarNegPerm] = {f: "__∌", b: "__∉"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarFuzPerm] = {f: "__/∍", b: "__∊/"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarPosTemp] = {f: "__~∍", b: "__∊~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarNegTemp] = {f: "__~∌", b: "__∉~"};
    SCs.SCnConnectors[sc.ScType.ArcAccessMetaVarFuzTemp] = {f: "__~/∍", b: "__∊/~"};
});
