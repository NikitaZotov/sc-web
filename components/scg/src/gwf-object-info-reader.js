GwfObjectInfoReader = {

    objects_info: {},
    errors: [],

    gwf_type_to_scg_type: {
        "node/-/not_define": sc.ScType.Node,

        "node/const/general_node": sc.ScType.NodeConst,
        "node/const/asymmetry": sc.ScType.NodeConstTuple,
        "node/const/nopredmet": sc.ScType.NodeConstStruct,
        "node/const/attribute": sc.ScType.NodeConstRole,
        "node/const/relation": sc.ScType.NodeConstNoRole,
        "node/const/material": sc.ScType.NodeConstMaterial,
        "node/const/group": sc.ScType.NodeConstClass,
        "node/const/predmet": sc.ScType.NodeConstAbstract,

        "node/var/general_node": sc.ScType.NodeVar,
        "node/var/symmetry": sc.ScType.NodeVarTuple,
        "node/var/nopredmet": sc.ScType.NodeVarStruct,
        "node/var/attribute": sc.ScType.NodeVarRole,
        "node/var/relation": sc.ScType.NodeVarNoRole,
        "node/var/material": sc.ScType.NodeVarMaterial,
        "node/var/group": sc.ScType.NodeVarClass,
        "node/var/predmet": sc.ScType.NodeVarAbstract,

        "arc/-/-": sc.ScType.ArcAccess,
        "arc/const/fuz/temp": sc.ScType.ArcAccessConstFuzTemp,
        "arc/const/fuz": sc.ScType.ArcAccessConstFuz,
        "arc/const/pos/temp": sc.ScType.ArcAccessConstPosTemp,
        "arc/const/pos": sc.ScType.ArcAccessConstPos,
        "arc/const/neg/temp": sc.ScType.ArcAccessConstNegTemp,
        "arc/const/neg": sc.ScType.ArcAccessConstNeg,
        "pair/const/orient": sc.ScType.ArcCommonConst,
        "pair/const/synonym": sc.ScType.EdgeCommonConst,
        "pair/orient": sc.ScType.ArcCommon,

        "pair/var/orient": sc.ScType.ArcCommonVar,
        "arc/var/fuz/temp": sc.ScType.ArcAccessVarFuzTemp,
        "arc/var/fuz": sc.ScType.ArcAccessVarFuz,
        "arc/var/pos/temp": sc.ScType.ArcAccessVarPosTemp,
        "arc/var/pos": sc.ScType.ArcAccessVarPos,
        "arc/var/neg/temp": sc.ScType.ArcAccessVarNegTemp,
        "arc/var/neg": sc.ScType.ArcAccessVarNeg,
        "pair/var/noorient": sc.ScType.ArcCommonVar,
        "pair/var/synonym": sc.ScType.EdgeCommonVar,
        "pair/noorient": sc.ScType.EdgeCommon
    },

    read: function (strs) {
        this.objects_info = {};
        var xml_doc = (new DOMParser()).parseFromString(strs, "text/xml");

        var root = xml_doc.documentElement;

        if (root.nodeName == "html") {
            alert(root.getElementsByTagName("div")[0].innerHTML);
            return false;
        } else if (root.nodeName != "GWF") {
            alert("Given document has unsupported format " + root.nodeName);
            return false;
        }

        var static_sector = this.parseGroupOfElements(root, "staticSector", true);

        if (static_sector == false)
            return false;


        static_sector = static_sector[0];

        //contours

        var contours = this.parseGroupOfElements(static_sector, "contour", false);
        this.forEach(contours, this.parseContour);

        //nodes
        var nodes = this.parseGroupOfElements(static_sector, "node", false);
        this.forEach(nodes, this.parseNode);

        //buses
        var buses = this.parseGroupOfElements(static_sector, "bus", false);
        this.forEach(buses, this.parseBus);

        //arcs
        var arcs = this.parseGroupOfElements(static_sector, "arc", false);
        this.forEach(arcs, this.parsePair);

        //pairs
        var arcs = this.parseGroupOfElements(static_sector, "pair", false);
        this.forEach(arcs, this.parsePair);

        if (this.errors.length == 0)
            return true;
        else
            return false;

    },

    printErrors: function () {
        for (var i = 0; i < this.errors.length; i++)
            console.log(this.errors[i]);
    },

    parseGroupOfElements: function (parent, tag_name, is_required) {
        var elements = parent.getElementsByTagName(tag_name);
        if (elements.length == 0 && is_required == true) {
            this.errors.push("Unnable to find " + tag_name + " tag");
            return false;
        }
        return elements;
    },

    parseContour: function (contour) {
        var parsed_contour = new GwfObjectContour(null);

        var result = parsed_contour.parseObject({gwf_object: contour, reader: this});

        if (result == false)
            return false;

        this.objects_info[parsed_contour.id] = parsed_contour;

    },

    parsePair: function (pair) {
        var parsed_pair = new GwfObjectPair(null);

        var result = parsed_pair.parseObject({gwf_object: pair, reader: this});

        if (result == false)
            return false;

        this.objects_info[parsed_pair.id] = parsed_pair;

    },

    parseNode: function (node) {
        var content = node.getElementsByTagName("content");
        var parsed_node;
        if (content[0].textContent == "") {
            parsed_node = new GwfObjectNode(null);
        } else {
            parsed_node = new GwfObjectLink(null);
        }
        if (parsed_node.parseObject({gwf_object: node, reader: this}) == false)
            return false;
        this.objects_info[parsed_node.id] = parsed_node;

    },

    parseBus: function (bus) {
        var parsed_bus = new GwfObjectBus(null);

        if (parsed_bus.parseObject({gwf_object: bus, reader: this}) == false)
            return false;
        this.objects_info[parsed_bus.id] = parsed_bus;
    },

    fetchAttributes: function (tag_element, required_attrs) {
        var tag_attributes = tag_element.attributes;
        var result_dict = {};

        for (var i = 0; i < required_attrs.length; i++) {
            var attribute = required_attrs[i];
            var found_attr = tag_attributes[attribute];
            if (found_attr != null) {
                result_dict[found_attr.name] = found_attr.value;
            } else {
                this.errors.push("Unnable to find " + attribute + " attribute.");
                return false;
            }
        }

        return result_dict;
    },

    forEach: function (array, fun) {
        for (var i = 0; i < array.length; i++)
            if (fun.call(this, array[i]) == false)
                return false;
    },

    getAttr: function (tag, attr_name) {
        return tag.getAttribute(attr_name);
    },

    getFloatAttr: function (tag, attr_name) {
        return parseFloat(this.getAttr(tag, attr_name));
    },
    getStrAttr: function (tag, attr_name) {

    },

    getTypeCode: function (gfw_type) {
        return this.gwf_type_to_scg_type[gfw_type];
    }
}
