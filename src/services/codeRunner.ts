export const runJS = (jsCode: string): string[] => {
  const logs: string[] = [];
  const mockConsole = {
    log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    error: (...args: any[]) => logs.push(`ERROR: ${args.join(' ')}`),
    warn: (...args: any[]) => logs.push(`WARN: ${args.join(' ')}`),
  };
  
  try {
    const fn = new Function('console', jsCode);
    fn(mockConsole);
    return logs.length ? logs : ['(Hakuna matokeo - tumia console.log() kuonyesha)'];
  } catch (e: any) {
    throw e;
  }
};

export const runSQL = (sqlCode: string): string[] => {
  const lines = sqlCode.split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
  const results: string[] = [];
  let hasSelect = false;

  lines.forEach(line => {
    const upper = line.toUpperCase().trim();
    if (upper.startsWith('CREATE TABLE')) {
      const match = line.match(/CREATE TABLE\s+(\w+)/i);
      results.push(`✓ Jedwali "${match ? match[1] : 'unknown'}" limetengenezwa`);
    } else if (upper.startsWith('INSERT')) {
      results.push('✓ Rekodi moja imeingizwa');
    } else if (upper.startsWith('SELECT')) {
      hasSelect = true;
      results.push('');
      results.push('JINA              KOZI    ALAMA');
      results.push('─'.repeat(40));
      results.push('Amina Hassan      ICT     92');
      results.push('John Mwamba       IT      85');
      results.push('');
      results.push('Safu 2 zimepatikana.');
    }
  });

  return results.length ? results : ['✓ SQL imetekelezwa bila makosa'];
};

export const simulatePython = (pyCode: string): string[] => {
  const lines = pyCode.split('\n');
  const output: string[] = [];
  const vars: Record<string, any> = {};

  const evalExpr = (expr: string): any => {
    expr = expr.trim();
    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      return expr.slice(2, -1).replace(/\{([^}]+)\}/g, (_, e) => String(evalExpr(e)));
    }
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (vars[expr] !== undefined) return vars[expr];
    if (!isNaN(Number(expr))) return Number(expr);
    
    try {
      const safe = expr.replace(/(\w+)/g, m => vars[m] !== undefined ? vars[m] : m);
      return eval(safe);
    } catch { return expr; }
  };

  lines.forEach(line => {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith('#')) return;

    const printMatch = stripped.match(/^print\((.*)\)$/);
    if (printMatch) {
      const args = printMatch[1].split(',').map(a => a.trim());
      output.push(args.map(a => String(evalExpr(a))).join(' '));
      return;
    }

    const assignMatch = stripped.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      vars[assignMatch[1]] = evalExpr(assignMatch[2]);
    }
  });

  return output.length ? output : ['(Hakuna matokeo - tumia print() kuonyesha)'];
};
