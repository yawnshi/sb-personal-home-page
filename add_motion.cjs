const fs = require('fs');

const files = [
    'src/pages/PersonalSpace.jsx',
    'src/pages/ArticlesHub.jsx',
    'src/pages/ArticleDetail.jsx'
];

files.forEach(filePath => {
    let data = fs.readFileSync(filePath, 'utf8');
    
    if (!data.includes("framer-motion")) {
        // Add import
        data = data.replace(/(import React.*?;)/, "$1\nimport { motion } from 'framer-motion';");
        
        // Add motion wrap
        data = data.replace(/return\s*\(\s*<div/, "return (\n    <motion.div\n      initial={{ opacity: 0, y: 15 }}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: -15 }}\n      transition={{ duration: 0.4 }}\n    >\n      <div");
        
        // Close motion wrap at end
        data = data.replace(/<\/div>\s*\);\s*}\s*$/, "</div>\n    </motion.div>\n  );\n}");
        
        fs.writeFileSync(filePath, data);
    }
});

console.log("Done");
