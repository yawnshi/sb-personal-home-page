import os
import re

files = [
    'src/pages/PersonalSpace.jsx',
    'src/pages/ArticlesHub.jsx',
    'src/pages/ArticleDetail.jsx'
]

for file_path in files:
    with open(file_path, 'r') as f:
        data = f.read()
    
    if "framer-motion" not in data:
        # Add import
        data = re.sub(r"(import React.*?;\n)", r"\1import { motion } from 'framer-motion';\n", data, count=1)
        
        # Add motion wrap
        data = re.sub(r"return\s*\(\s*<div", "return (\n    <motion.div\n      initial={{ opacity: 0, y: 15 }}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: -15 }}\n      transition={{ duration: 0.4 }}\n    >\n      <div", data, count=1)
        
        # Close motion wrap at end
        # Find last </div>\n  );\n}
        data = re.sub(r"</div>\s*\);\s*}\s*$", "</div>\n    </motion.div>\n  );\n}", data)
        
        with open(file_path, 'w') as f:
            f.write(data)
    
print("Done")
