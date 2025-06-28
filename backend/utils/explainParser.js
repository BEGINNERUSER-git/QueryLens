export const explainParser = (rows) => {
  if (!rows || !rows.length) return null;

  const explainJsonStr = rows[0].EXPLAIN;
  const explainObj = JSON.parse(explainJsonStr); // ✅ Convert string to object

  const parseNode = (node, name = 'query_block') => {
    let result = {
      name: name,
      children: [],
      details: {}
    };

    // If it's a table node (leaf)
    if (node.table_name) {
      result.name = `${node.access_type || ''} - ${node.table_name}`;
      result.details = {
        rows_examined_per_scan: node.rows_examined_per_scan,
        rows_produced_per_join: node.rows_produced_per_join,
        filtered: node.filtered,
        key: node.key,
        used_columns: node.used_columns,
        cost_info: node.cost_info
      };
    }

    // If it's a query block or nested node
    for (const key in node) {
      if (typeof node[key] === 'object' && node[key] !== null) {
        const child = parseNode(node[key], key);
        if (child) result.children.push(child);
      }
    }

    return result;
  };

  const root = parseNode(explainObj.query_block);

  return root;
};
