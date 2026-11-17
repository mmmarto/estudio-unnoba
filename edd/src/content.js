/* content.js — teoría de la guía de EDD. Editar acá para agregar/cambiar material. */
var DATA = {};
function EC(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function CODE(s) { return '<pre><code>' + EC(s.replace(/^\n/, '').replace(/\s+$/, '')) + '</code></pre>'; }

/* ============ QUÉ TOMAN (resumen del banco de 8 finales) ============ */
DATA.toman = [
  ['Complejidad / T(n)', 'alta', 'Qué es la complejidad temporal, T(n) y Big-O de un código con ciclos (a veces con log), O(n) vs O(n²), análisis empírico vs teórico', '8 de 8'],
  ['Recursión', 'alta', 'Función recursiva que cuenta algo en una lista o un árbol (caso base, caso recursivo, complejidad), recursiva vs iterativa, Fibonacci', '8 de 8'],
  ['ABB / AVL', 'alta', 'Búsqueda recursiva e iterativa en un ABB, recorridos, ¿es AVL?, inserción con rotaciones, ABB vs AVL', '8 de 8'],
  ['Grafos', 'alta', 'Lista vs matriz de adyacencia (siempre), BFS / DFS, Dijkstra, propiedades (conexo, ciclo, hamiltoniano)', '8 de 8'],
  ['Casos: ¿qué estructura usarías?', 'alta', 'Un escenario con operaciones frecuentes y hay que elegir y justificar (20 de las 79 preguntas)', '8 de 8'],
  ['Hash', 'alta', 'Colisiones y dos técnicas para resolverlas, factor de carga, sondeo lineal / cuadrático / doble hash, insertar claves a mano', '7 de 8'],
  ['TAD y estructuras lineales', 'alta', 'Definiciones (TAD, estructura de datos), especificación vs implementación, pila / cola / lista con arreglo y con nodos', '7 de 8'],
  ['Árboles B / B+ / B*', 'media', 'Casi siempre "por qué B o B+ para disco"; a veces las propiedades de orden m y qué pasa al desbordar', '5 de 8']
];

/* ============ TARJETAS DE TEORÍA ============ */
/* id · prio (alta/media/baja) · t · uso · def · simple · ej · warn */
DATA.teoria = [

/* ---------- ANÁLISIS DE ALGORITMOS ---------- */
{ id:'eficiencia', prio:'alta', t:'Eficiencia y complejidad temporal', uso:'Complejidad · 8 de 8 finales',
  def:'La eficiencia de un algoritmo es la cantidad de recursos (tiempo y memoria) que necesita según el tamaño <i>n</i> de la entrada. El <b>costo temporal</b> es el número de pasos <b>T(n)</b>, donde un paso es una operación cuyo tiempo no depende de <i>n</i> (asignación, comparación, operación aritmética, acceso a un elemento).',
  simple:'No se mide en segundos: se cuenta cuántas veces se hace lo importante cuando <i>n</i> crece. Así el resultado no depende de la computadora, del lenguaje ni de qué más esté corriendo. Por eso el análisis de complejidad sirve más que medir el tiempo en una máquina.',
  ej:'<b>Búsqueda lineal</b>, peor caso (el elemento no está): revisa los <i>n</i> elementos → T(n) ≈ n. <b>Búsqueda binaria</b> en un arreglo ordenado: descarta la mitad en cada paso → ≈ log₂ n. Con n = 1.000.000: lineal hasta 1.000.000 de comparaciones, binaria unas 20.',
  warn:'T(n) se calcula para el <b>peor caso</b> salvo que pidan otra cosa. Y si A es O(n) y B es O(n²), eso NO significa que A sea más rápido para cualquier <i>n</i>: con n chico (por ejemplo n = 100) las constantes pueden hacer que B gane. El análisis asintótico habla de <i>n</i> grande.' },
{ id:'bigo', prio:'alta', t:'Notación asintótica: O, Ω, Θ y por qué se omiten las constantes', uso:'Complejidad · 8 de 8 finales',
  def:'<b>O(f(n))</b> es una cota superior (el peor caso), <b>Ω(f(n))</b> una cota inferior (el mejor caso) y <b>Θ(f(n))</b> una cota ajustada. Para pasar de T(n) a O: 1) contar las operaciones elementales, 2) eliminar constantes y términos de menor orden, 3) escribir la notación.',
  simple:'Las constantes se omiten porque dependen de la máquina y del lenguaje y no cambian <i>cómo crece</i> el costo: 3n + 2 y 100n crecen igual de rápido (lineal). Lo que importa es la forma de la curva, no cuánto vale cada paso.',
  ej:'<div class="tbl"><table><thead><tr><th>Clase</th><th>Nombre</th><th>Ejemplo</th></tr></thead><tbody><tr><td>O(1)</td><td>constante</td><td>acceder a un elemento de un arreglo</td></tr><tr><td>O(log n)</td><td>logarítmica</td><td>búsqueda binaria</td></tr><tr><td>O(n)</td><td>lineal</td><td>recorrer una lista</td></tr><tr><td>O(n log n)</td><td>cuasilineal</td><td>merge sort</td></tr><tr><td>O(n²)</td><td>cuadrática</td><td>burbuja, selección, inserción</td></tr><tr><td>O(2ⁿ)</td><td>exponencial</td><td>Fibonacci recursivo</td></tr></tbody></table></div><p class="muted">O(1) ⊆ O(log n) ⊆ O(n) ⊆ O(n log n) ⊆ O(n²) ⊆ O(2ⁿ) ⊆ O(n!)</p>',
  warn:'Cada clase incluye a las anteriores: un algoritmo O(n) también <i>es</i> O(n²) y O(2ⁿ) (cota superior válida pero floja), pero NO es O(log n) ni O(1). Si piden "el orden", la respuesta es la cota más ajustada. Y O(n/2) u O(n + 4) no se escriben: se simplifican a O(n).' },
{ id:'tn', prio:'alta', t:'Cómo calcular T(n) y el orden de un código con ciclos', uso:'Complejidad · aparece con código en 4 finales',
  def:'Reglas para código iterativo: la <b>secuencia suma</b> los costos, el <b>condicional</b> toma el peor caso y el <b>ciclo multiplica</b> (vueltas × costo del cuerpo). Si la variable de control se suma o resta una constante, el ciclo es <b>lineal</b>; si se multiplica o divide por una constante, es <b>logarítmico</b>. Ciclos anidados: se multiplican.',
  simple:'<ol><li>Mirá cuántas vueltas da cada ciclo: ¿avanza de a 1? ¿se duplica? ¿arranca en <code>i</code>?</li><li>Si el ciclo interno <b>no depende</b> del externo, multiplicá. Si depende (arranca o llega hasta <code>i</code>), sumá la serie 1 + 2 + … + n = n(n+1)/2.</li><li>T(n) = cuántas veces se ejecuta el paso elemental (el <code>Println</code>).</li><li>Quedate con el término de mayor orden y sacá las constantes.</li></ol>',
  ej:'<div class="tbl"><table><thead><tr><th>Código</th><th>T(n)</th><th>Orden</th></tr></thead><tbody><tr><td>para i←1..n; j←1; mientras j&lt;n: j←j·2 <span class="muted">(Septiembre)</span></td><td>n · ⌈log₂ n⌉</td><td>O(n log n)</td></tr><tr><td>for i&lt;n { j:=n; for j&gt;0 { j=j/2 } } <span class="muted">(Modelo General)</span></td><td>(n−1)(⌊log₂ n⌋+1)</td><td>O(n log n)</td></tr><tr><td>for i≤n { for j≤i } <span class="muted">(Julio 2026)</span></td><td>n(n+1)/2</td><td>O(n²)</td></tr><tr><td>for i&lt;n { for j:=i; j&lt;n } <span class="muted">(TP1)</span></td><td>n(n+1)/2</td><td>O(n²)</td></tr></tbody></table></div><p>Probalo con la pestaña <b>Complejidad</b>: genera códigos y compara tu respuesta con la ejecución real.</p>',
  warn:'Cuando el interno depende de <code>i</code> no es n·n: es la serie n(n+1)/2. Sigue siendo O(n²), pero el T(n) exacto que piden en el final es ese. Y si pasa de <code>j &lt; n</code> con <code>j *= 2</code>, el ciclo da ⌈log₂ n⌉ vueltas, no n.' },
{ id:'emp-teo', prio:'media', t:'Análisis empírico vs análisis teórico', uso:'Complejidad · 3 finales',
  def:'<b>Empírico (a posteriori):</b> se implementa el algoritmo, se mide en una computadora con distintos casos de prueba (mejor, peor y promedio) y se grafican los resultados. <b>Teórico (a priori):</b> se determina matemáticamente la cantidad de recursos (tiempo y espacio) en función de <i>n</i>, sin implementar ni ejecutar.',
  simple:'<div class="tbl"><table><thead><tr><th></th><th>Ventajas</th><th>Desventajas</th></tr></thead><tbody><tr><th>Empírico</th><td>Mide el comportamiento real, con el hardware y el lenguaje que se van a usar</td><td>Hay que implementarlo; depende del hardware y del entorno; no da una fórmula general; no se puede probar todo <i>n</i>; no predice escalas mayores</td></tr><tr><th>Teórico</th><td>No depende de la máquina; no requiere implementar; permite comparar y predecir para <i>n</i> grande</td><td>Ignora constantes y el hardware, así que con <i>n</i> chico puede no reflejar el tiempo real; el caso promedio es difícil de calcular</td></tr></tbody></table></div>',
  ej:'Medir con <code>time.Now()</code> una búsqueda lineal con n = 1.000, 10.000 y 100.000 es análisis empírico. Contar que hace n comparaciones en el peor caso es análisis teórico.',
  warn:'Criterios para elegir entre dos algoritmos (Junio 2024): tiempo (complejidad temporal), espacio (memoria), y que se adapte al problema (tamaño de <i>n</i>, si los datos vienen ordenados, qué operación es más frecuente).' },

/* ---------- TAD Y LINEALES ---------- */
{ id:'tad', prio:'alta', t:'Dato, tipo de dato, TAD, estructura de datos y algoritmo', uso:'TAD · 7 de 8 finales',
  def:'Un <b>TAD</b> (tipo abstracto de datos) define un conjunto de datos y las operaciones permitidas sobre ellos <b>sin decir cómo se implementan</b>: separa la especificación de la implementación. Una <b>estructura de datos</b> es la forma concreta de organizar los datos en memoria (arreglo, nodos enlazados) para implementar un TAD.',
  simple:'<div class="tbl"><table><thead><tr><th>Concepto</th><th>Qué es</th><th>Ejemplo</th></tr></thead><tbody><tr><td>Dato</td><td>un valor concreto</td><td>25</td></tr><tr><td>Tipo de dato</td><td>conjunto de valores con sus operaciones; lo da el lenguaje</td><td>int, float</td></tr><tr><td>TAD</td><td>qué se puede hacer (datos + operaciones), no cómo</td><td>Pila: apilar, desapilar, tope</td></tr><tr><td>Estructura de datos</td><td>cómo se guarda en memoria para implementar el TAD</td><td>arreglo, nodos con punteros</td></tr><tr><td>Algoritmo</td><td>pasos que realizan una operación o resuelven el problema</td><td>apilar en O(1)</td></tr></tbody></table></div><p>Cómo se articulan: el problema se modela con un TAD (nivel lógico), se elige una estructura de datos que lo implemente y los algoritmos operan sobre esa estructura. Los datos son de un tipo que ofrece el lenguaje.</p>',
  ej:'<b>Editor con deshacer:</b> el TAD es Pila (apilar cada acción, desapilar para deshacer); se implementa con un arreglo o con nodos; el algoritmo de deshacer es "desapilar y revertir lo que dice el tope".',
  warn:'Tres niveles: <b>especificación</b> (nivel lógico: datos, operaciones, comportamiento con pre y postcondiciones) → <b>implementación</b> (estructura y algoritmos) → <b>aplicación</b> (quien usa el TAD no sabe cómo está hecho). La especificación nunca nombra punteros ni arreglos. Pasos para construir un TAD (Septiembre): especificar, implementar y usarlo desde la aplicación.' },
{ id:'tad-espec', prio:'media', t:'Especificación de un TAD: la plantilla de la cátedra', uso:'TAD · TP2',
  def:'La especificación incluye: <b>Igualdad observacional</b> (cuándo dos estructuras son iguales), <b>Usa</b> (otros tipos), <b>Parámetro formal</b> (TAD genérico), <b>Géneros</b>, <b>Observadores básicos</b> (consultan), <b>Generadores</b> (crean), <b>Otras operaciones</b> (modifican), <b>Axiomas</b> (comportamiento) y <b>Exporta</b>. Propiedades deseables: precisión, generalidad, legibilidad y no ambigüedad.',
  simple:'Cada operación se escribe con su sintaxis (nombre, tipos de entrada y salida) y, si hace falta, precondición <code>{Pre: …}</code> y postcondición <code>{Pos: …}</code>.',
  ej:'<b>TAD Pila&lt;a&gt;</b> · Observadores: <code>tamaño(Pila)→Natural</code>, <code>es_vacía(Pila)→Booleano</code>, <code>tope(Pila)→a {Pre: no vacía}</code> · Generadores: <code>crear_vacía()</code>, <code>crear_a_partir_de(Secuencia)</code> · Otras: <code>apilar(Pila, a)</code> {Pos: no vacía}, <code>desapilar(Pila)→a</code> {Pre: no vacía}.',
  warn:'Errores típicos al revisar una especificación (TP2): poner <code>apilar</code> entre los observadores, olvidar la precondición de <code>tope</code> y <code>desapilar</code>, definir la igualdad solo con "tienen los mismos elementos" (falta el orden) y no exportar los generadores.' },
{ id:'pila', prio:'alta', t:'Pila (LIFO): arreglo vs nodos', uso:'Estructuras lineales · 4 finales',
  def:'Una pila agrega y quita elementos <b>por el mismo extremo</b> (el tope): último en entrar, primero en salir (LIFO). Operaciones: apilar, desapilar, tope, tamaño, es_vacía.',
  simple:'<div class="tbl"><table><thead><tr><th>Aspecto</th><th>Con arreglo</th><th>Con nodos</th></tr></thead><tbody><tr><td>Tamaño</td><td>fijo (puede llenarse)</td><td>dinámico</td></tr><tr><td>Memoria</td><td>contigua; sin punteros extra</td><td>no contigua; un puntero por elemento</td></tr><tr><td>apilar / desapilar / tope</td><td>O(1)</td><td>O(1)</td></tr><tr><td>Tamaño de la pila</td><td>O(1) con el índice del tope</td><td>O(n) si se recorre; O(1) si se guarda un contador</td></tr><tr><td>Implementación</td><td>más simple</td><td>más compleja</td></tr></tbody></table></div><p><b>Caso para arreglo:</b> se conoce el máximo de elementos (por ejemplo, el historial de deshacer acotado a 100 acciones). <b>Caso para nodos:</b> no se sabe cuántos habrá (pila de llamadas de un recorrido, expresiones de largo cualquiera).</p>',
  ej:'Usos: deshacer / rehacer, pila de llamadas de la recursión, evaluar expresiones, balanceo de paréntesis, DFS. <b>Deshacer y rehacer</b> se hace con <b>dos pilas</b>: al deshacer se desapila de "deshacer" y se apila en "rehacer"; cualquier acción nueva vacía "rehacer".',
  warn:'En el final corregido, "deshacer y rehacer" sacó 0: una sola pila no alcanza para rehacer. Hacen falta dos.' },
{ id:'cola', prio:'alta', t:'Cola (FIFO): arreglo circular vs nodos', uso:'Estructuras lineales · 3 finales',
  def:'Una cola agrega por un extremo (final) y quita por el otro (frente): primero en entrar, primero en salir (FIFO). Operaciones: encolar, desencolar, frente, tamaño, es_vacía.',
  simple:'<ul><li><b>Arreglo circular:</b> dos índices (frente y final) que dan la vuelta con módulo. Encolar y desencolar O(1) sin correr elementos. Capacidad fija. Un arreglo lineal obligaría a correr todo en cada desencolar: O(n).</li><li><b>Nodos:</b> punteros al <b>frente y al final</b>. Encolar agrega al final y desencolar saca del frente, ambos O(1). Tamaño dinámico, pero un puntero por elemento. (Con solo un puntero al frente, encolar sería O(n).)</li></ul>',
  ej:CODE(`
type Nodo struct { valor int; sig *Nodo }
type Cola struct { frente, final *Nodo }

func (c *Cola) Encolar(v int) {
    n := &Nodo{valor: v}
    if c.final == nil { c.frente = n } else { c.final.sig = n }
    c.final = n
}
func (c *Cola) Desencolar() (int, bool) {
    if c.frente == nil { return 0, false }
    v := c.frente.valor
    c.frente = c.frente.sig
    if c.frente == nil { c.final = nil }
    return v, true
}`) + '<p>Usos: turnos, cola de impresión (orden de llegada), mensajes que se leen en el orden enviado, BFS, buffers.</p>',
  warn:'Para que <b>longitud</b> sea O(1) (TP2) hay que guardar un contador que se actualice en cada operación. Una cola doblemente terminada (deque) se implementa con nodos dobles y punteros a ambos extremos para que encolar y desencolar por cualquier lado sean O(1).' },
{ id:'lista', prio:'media', t:'Listas: arreglo vs nodos, simple vs doble', uso:'Estructuras lineales · 3 finales',
  def:'Una estructura lineal tiene un único predecesor por elemento (menos el primero). Una lista admite insertar, eliminar y consultar en <b>cualquier posición</b>. Puede ser <b>simple</b> (un puntero al siguiente), <b>doble</b> (siguiente y anterior) o circular.',
  simple:'<div class="tbl"><table><thead><tr><th>Operación</th><th>Arreglo</th><th>Lista enlazada</th></tr></thead><tbody><tr><td>Acceso a una posición</td><td>O(1) (acceso directo)</td><td>O(n) (acceso secuencial)</td></tr><tr><td>Insertar / eliminar en el medio</td><td>O(n): hay que correr elementos</td><td>O(1) una vez ubicado el nodo (ubicarlo cuesta O(n))</td></tr><tr><td>Tamaño</td><td>estático: hay que conocerlo de antemano</td><td>dinámico</td></tr><tr><td>Memoria</td><td>contigua, sin punteros</td><td>no contigua, un puntero por nodo</td></tr></tbody></table></div><p><b>Simple o doble:</b> doble si necesitás recorrer hacia atrás o eliminar un nodo teniéndolo en mano (sin buscar el anterior); simple si solo avanzás y la memoria importa.</p>',
  ej:'Un editor con deshacer y una cola de impresión: una lista enlazada crece sin fijar el tamaño y no corre elementos al insertar o eliminar.',
  warn:'Al comparar, nombrá las tres operaciones que suelen pedir: <b>acceso a una posición</b>, <b>inserción</b> y <b>eliminación</b>.' },

/* ---------- RECURSIÓN ---------- */
{ id:'recursion', prio:'alta', t:'Recursión: caso base, caso recursivo y pila de llamadas', uso:'Recursión · 8 de 8 finales',
  def:'La recursión resuelve un problema con una función que se llama a sí misma sobre un subproblema más chico. Toda función recursiva válida necesita: 1) un <b>caso base</b> que corta la recursión y 2) un <b>caso recursivo</b> cuyo llamado se <b>acerca</b> al caso base.',
  simple:'<b>Recursión vs iteración:</b> las dos repiten tareas. La recursiva es más corta y natural en problemas recursivos (árboles, grafos) pero usa memoria de la pila de llamadas (puede desbordar si falta el caso base). La iterativa es más eficiente en memoria. Normalmente tienen la misma complejidad temporal.',
  ej:CODE(`
func factorial(n int) int {
    if n == 0 { return 1 }          // caso base
    return n * factorial(n-1)       // caso recursivo
}
// factorial(3) → 3 * factorial(2) → 2 * factorial(1) → 1 * factorial(0) → 1
// vuelve: 1 → 1·1 = 1 → 2·1 = 2 → 3·2 = 6`),
  warn:'"Condiciones mínimas para ser válida" (Julio 2025): caso base alcanzable y llamado recursivo que reduce el problema. Si te piden comparar la versión recursiva con la iterativa: mismo orden temporal, pero la recursiva suma O(n) de espacio de pila.' },
{ id:'rec-struct', prio:'alta', t:'Funciones recursivas sobre listas y árboles (las que piden)', uso:'Recursión · 4 finales piden una',
  def:'Todas siguen el mismo molde: el <b>caso base</b> es la estructura vacía (<code>nil</code>) y el <b>caso recursivo</b> combina el resultado de la parte restante. Visitan cada nodo una vez → <b>O(n)</b> en tiempo y O(altura) de pila.',
  simple:'Contar elementos de una lista (Agosto 2026), contar elementos pares (Julio 2025), contar nodos de un árbol (Modelo) y contar hojas (Julio 2026). Siempre aclará: caso base, caso recursivo y complejidad.',
  ej:CODE(`
type Nodo struct { valor int; sig *Nodo }
func cantidad(n *Nodo) int {
    if n == nil { return 0 }                  // base: lista vacía
    return 1 + cantidad(n.sig)                // recursivo
}
func pares(n *Nodo) int {
    if n == nil { return 0 }
    if n.valor%2 == 0 { return 1 + pares(n.sig) }
    return pares(n.sig)
}

type ArbolBB struct { valor int; hijo_izq, hijo_der *ArbolBB }
func cantidadNodos(a *ArbolBB) int {
    if a == nil { return 0 }
    return 1 + cantidadNodos(a.hijo_izq) + cantidadNodos(a.hijo_der)
}
func hojas(a *ArbolBB) int {
    if a == nil { return 0 }                              // vacío
    if a.hijo_izq == nil && a.hijo_der == nil { return 1 } // hoja
    return hojas(a.hijo_izq) + hojas(a.hijo_der)
}
func altura(a *ArbolBB) int {   // en aristas: vacío = -1, hoja = 0
    if a == nil { return -1 }
    return 1 + max(altura(a.hijo_izq), altura(a.hijo_der))
}`),
  warn:'Julio 2026 pide "determinar si el árbol está vacío y, si no, retornar la cantidad de hojas": el caso base <code>a == nil</code> es justamente el "está vacío". Aclaralo en la respuesta. Y la versión iterativa (Julio 2025) es un <code>for</code> con un contador: mismo O(n), sin pila de llamadas.' },
{ id:'rec-costo', prio:'alta', t:'Complejidad de algoritmos recursivos (Fibonacci)', uso:'Recursión · final corregido (5 pts)',
  def:'Se mira cuántos llamados recursivos se ejecutan y cómo cambia el parámetro de control: <b>O(n)</b> si hay un llamado y el parámetro baja en una constante (factorial); <b>O(log n)</b> si hay un llamado y el parámetro se divide (búsqueda binaria); <b>O(cⁿ)</b> si hay c llamados y el parámetro baja en una constante (Fibonacci); <b>O(n log n)</b> si hay 2 llamados y el parámetro se divide (merge sort).',
  simple:'<b>Fibonacci recursivo:</b> T(n) = T(n−1) + T(n−2) + c, con T(0) = T(1) = c. El árbol de llamadas se duplica en cada nivel y tiene profundidad n → <b>O(2ⁿ)</b> (la cota ajustada es ≈ 1,618ⁿ). Repite subproblemas: fibonacci(2) se calcula 2 veces dentro de fibonacci(4).<br><b>Fibonacci iterativo</b> (dos variables): n vueltas → T(n) ≈ n → <b>O(n)</b>.',
  ej:CODE(`
func fibIter(n int) int {
    if n <= 1 { return n }
    a, b := 0, 1
    for i := 2; i <= n; i++ { a, b = b, a+b }   // n-1 vueltas
    return b
}`) + '<p>Cantidad de llamados de la versión recursiva (con base n ≤ 1): fib(4) → 9 llamados (fib(2) se llama 2 veces); fib(6) → 25. factorial(5) → 6 llamados (n = 5, 4, 3, 2, 1, 0).</p>',
  warn:'Ese ejercicio valía 5 de 30 puntos y salió 0/5. Para asegurar puntos: escribí el código, planteá <b>T(n) = T(n−1) + T(n−2) + c</b>, concluí O(2ⁿ) explicando el árbol de llamadas y, si querés, sumá la versión iterativa O(n).' },
{ id:'busq-orden', prio:'media', t:'Búsqueda y ordenamiento: lineal, binaria, burbuja, selección, inserción, quick y merge', uso:'Recursión · material de cátedra',
  def:'<b>Búsqueda lineal</b> O(n). <b>Búsqueda binaria</b> O(log n), exige arreglo ordenado: compara con el medio y descarta una mitad. Se puede hacer iterativa o recursiva: mismo O(log n), pero la iterativa usa menos memoria.',
  simple:'<div class="tbl"><table><thead><tr><th>Algoritmo</th><th>Mejor</th><th>Promedio / peor</th><th>Idea</th></tr></thead><tbody><tr><td>Selección</td><td>O(n²)</td><td>O(n²)</td><td>busca el mínimo y lo cambia al principio</td></tr><tr><td>Burbuja</td><td>O(n²)*</td><td>O(n²)</td><td>intercambia vecinos desordenados</td></tr><tr><td>Inserción</td><td>O(n)</td><td>O(n²)</td><td>inserta cada elemento en la parte ordenada</td></tr><tr><td>Quick sort</td><td>O(n log n)</td><td>prom. O(n log n) · peor O(n²)</td><td>pivote + dividir en menores y mayores</td></tr><tr><td>Merge sort</td><td>O(n log n)</td><td>O(n log n)</td><td>divide en mitades y fusiona (la fusión cuesta O(n), hay log n niveles)</td></tr></tbody></table></div><p class="muted">* con la versión que corta cuando no hubo intercambios sería O(n).</p>',
  ej:'Búsqueda binaria de 31 en [3, 8, 15, 19, 25, 31, 42, 57, 63, 79]: (inicio, fin, medio) = (0, 9, 4) → 25 &lt; 31, sigue en la derecha → (5, 9, 7) → 57 &gt; 31, sigue a la izquierda → (5, 6, 5) → 31 encontrado en la posición 5.',
  warn:'Quick sort en el peor caso (pivote siempre mínimo o máximo) es O(n²). Merge sort siempre divide en partes iguales: siempre O(n log n).' },

/* ---------- ÁRBOLES / ABB ---------- */
{ id:'arboles', prio:'media', t:'Árboles: terminología y por qué son una estructura recursiva', uso:'ABB / AVL · 8 de 8 finales',
  def:'Un árbol es una estructura jerárquica donde cada nodo tiene un padre, salvo la <b>raíz</b>. Es <b>recursiva</b>: un nodo solo ya es un árbol, y un árbol es una raíz con sus <b>subárboles</b>, que a su vez son árboles. Por eso casi todas las operaciones se escriben recursivas, con el árbol vacío como caso base.',
  simple:'<ul><li><b>Hoja:</b> sin hijos. <b>Interno:</b> con al menos un hijo. <b>Hermanos:</b> mismo padre.</li><li><b>Grado</b> de un nodo: cantidad de hijos; grado del árbol: el máximo.</li><li><b>Profundidad</b> de un nodo: aristas desde la raíz. <b>Nivel</b> = profundidad + 1.</li><li><b>Altura</b> de un nodo: aristas del camino más largo hasta una hoja (hoja = 0). Altura del árbol = altura de la raíz.</li><li>Un árbol <b>binario</b> tiene a lo sumo 2 hijos por nodo. Con altura <i>h</i> (en aristas) tiene como máximo 2<sup>h+1</sup> − 1 nodos.</li></ul>',
  ej:'ABB de 45, 20, 60, 10, 30, 50, 70, 25, 35: altura 3 (la hoja más profunda, 25 o 35, está a 3 aristas); profundidad del 35 = 3; nivel del 35 = 4.',
  warn:'En el código Go del AVL la altura de una hoja es 1 (y la del nodo vacío 0), pero en la teoría de árboles es 0. Es solo una convención de implementación: aclará cuál usás.' },
{ id:'recorridos', prio:'alta', t:'Recorridos: preorden, inorden y postorden', uso:'ABB / AVL · 3 finales con árbol dibujado',
  def:'<b>Preorden:</b> raíz, subárbol izquierdo, subárbol derecho. <b>Inorden:</b> izquierdo, raíz, derecho. <b>Postorden:</b> izquierdo, derecho, raíz. Se definen recursivamente.',
  simple:'<b>Para reconocer el recorrido de una lista de nodos:</b> mirá dónde está la raíz. Si es el <b>primero</b> → preorden. Si es el <b>último</b> → postorden. Si queda en el medio (y en un ABB la lista sale ordenada) → inorden.<br><b>Aplicaciones:</b> preorden para copiar o reconstruir el árbol; inorden en un ABB da las claves en orden ascendente; postorden para eliminar el árbol o evaluar expresiones (primero los operandos).',
  ej:'Marzo: la secuencia <code>a, b, d, e, f, g, h, c, i</code> empieza con la raíz <b>a</b> → <b>preorden</b>. Junio 2024: <code>d, e, f, g, b, a, h, c, i</code> termina con la raíz <b>i</b> → <b>postorden</b>.<br>ABB de 45, 20, 60, 10, 30, 50, 70, 25, 35 → preorden <code>45 20 10 30 25 35 60 50 70</code> · inorden <code>10 20 25 30 35 45 50 60 70</code> · postorden <code>10 25 35 30 20 50 70 60 45</code>.',
  warn:'Siempre da el inorden de un ABB ordenado: si no sale ordenado, el árbol no es un ABB.' },
{ id:'abb', prio:'alta', t:'ABB: propiedad, operaciones y costo', uso:'ABB / AVL · 8 de 8 finales',
  def:'Un árbol binario de búsqueda cumple: todo nodo del subárbol izquierdo es menor que la raíz y todo nodo del derecho es mayor (en cada subárbol). Búsqueda, inserción y eliminación cuestan <b>O(h)</b>, donde <i>h</i> es la altura.',
  simple:'<ul><li><b>Mejor caso / árbol balanceado:</b> h ≈ log₂ n → O(log n).</li><li><b>Peor caso:</b> si las claves llegan ordenadas (10, 20, 30, 40, 50) el árbol degenera en una lista → h = n → O(n).</li><li><b>Eliminar</b> tiene 3 casos: hoja (se quita), un hijo (lo reemplaza su hijo) y dos hijos (se reemplaza por el <b>sucesor</b> —el mínimo del subárbol derecho— y se elimina ese nodo).</li><li><b>Representación:</b> con nodos (memoria dinámica, inserciones simples, un puntero por hijo) o con arreglo (hijos en 2i+1 y 2i+2; acceso rápido y poca memoria en árboles balanceados, pero insertar y eliminar es costoso).</li></ul>',
  ej:'Secuencia 50, 30, 70, 20, 40, 60, 80 → raíz 50; 30 y 70 como hijos; 20, 40, 60 y 80 como hojas. Inorden: 20 30 40 50 60 70 80.',
  warn:'Consecuencias de un ABB desbalanceado (final corregido): la altura se acerca a n, así que búsqueda, inserción y eliminación pasan de O(log n) a O(n); un AVL evita eso y mantiene O(log n).' },
{ id:'abb-busqueda', prio:'alta', t:'Búsqueda en un ABB: recursiva vs iterativa (20 pts en Marzo)', uso:'ABB / AVL · Septiembre y Marzo, idéntica',
  def:'Se compara la clave con la raíz: si es igual, se encontró; si es menor, se busca en el subárbol izquierdo; si es mayor, en el derecho; si se llega a un árbol vacío, no está.',
  simple:'<b>Recursiva:</b> más corta y natural (el árbol es recursivo), pero usa la pila de llamadas: O(h) de memoria, y en un árbol degenerado hasta O(n). <b>Iterativa:</b> un <code>for</code> que baja por el árbol, O(1) de memoria y sin riesgo de desborde, pero un poco menos legible. <b>Tiempo:</b> las dos O(h) (O(log n) balanceado, O(n) peor caso).',
  ej:CODE(`
func buscarRec(a *ArbolBB, x int) *ArbolBB {
    if a == nil || a.valor == x { return a }      // no está / encontrado
    if x < a.valor { return buscarRec(a.hijo_izq, x) }
    return buscarRec(a.hijo_der, x)
}
func buscarIter(a *ArbolBB, x int) *ArbolBB {
    for a != nil && a.valor != x {
        if x < a.valor { a = a.hijo_izq } else { a = a.hijo_der }
    }
    return a                                      // nil si no está
}`),
  warn:'La consigna del final pide cuatro cosas: la recursiva, <b>explicar cómo funciona</b>, la iterativa y la <b>comparación</b> con ventajas y desventajas. No te quedes solo con el código.' },

/* ---------- AVL ---------- */
{ id:'avl', prio:'alta', t:'AVL: definición, factor de equilibrio y por qué garantiza O(log n)', uso:'ABB / AVL · 8 de 8 finales',
  def:'Un AVL es un ABB autobalanceado: en todo nodo, <b>|altura(der) − altura(izq)| ≤ 1</b>. El <b>factor de equilibrio</b> es FE = H(der) − H(izq) y debe ser −1, 0 o 1. Si una inserción o eliminación rompe la condición, se corrige con rotaciones.',
  simple:'<b>Por qué es eficiente:</b> la condición de balance obliga a que la altura crezca de forma logarítmica. Un AVL de altura <i>h</i> necesita como mínimo N(h) = N(h−1) + N(h−2) + 1 nodos (crece como Fibonacci, exponencial), o sea que con <i>n</i> nodos la altura es O(log n). Como búsqueda, inserción y eliminación cuestan O(h), todas son <b>O(log n) garantizado</b>, incluso con claves que llegan ordenadas.<br><br><b>¿El árbol es AVL?</b><ol><li>¿Es un ABB? (el inorden sale ordenado)</li><li>Calculá las alturas de abajo hacia arriba.</li><li>Calculá el FE de <b>cada</b> nodo.</li><li>Si algún |FE| ≥ 2 → no es AVL: nombrá los nodos que fallan.</li></ol>',
  ej:'Marzo (a(b(d, e(f, g(h, -))), c(-, i))): FE(h) = 0, FE(g) = −1, FE(e) = +1, FE(b) = +2, FE(c) = +1, FE(a) = −2 → <b>no es AVL</b>: fallan b (+2) y a (−2).',
  warn:'Un AVL tiene que ser <b>ABB y balanceado</b>. En Junio 2024 el árbol dibujado está balanceado (todos los FE entre −1 y 1) pero con las letras como claves el inorden <code>d f e i g b c h a</code> no está ordenado: aclaralo. Justificá siempre con los FE nodo por nodo.' },
{ id:'avl-rot', prio:'alta', t:'Rotaciones del AVL: qué rotación usar', uso:'ABB / AVL · Modelo General',
  def:'<div class="tbl"><table><thead><tr><th>FE del nodo</th><th>FE del hijo</th><th>Caso</th><th>Rotación</th></tr></thead><tbody><tr><td>+2</td><td>+1 (o 0 al eliminar)</td><td>Derecha-Derecha</td><td>simple a izquierda</td></tr><tr><td>+2</td><td>−1</td><td>Derecha-Izquierda</td><td>doble a izquierda: simple a derecha sobre el hijo y simple a izquierda sobre el nodo</td></tr><tr><td>−2</td><td>−1 (o 0 al eliminar)</td><td>Izquierda-Izquierda</td><td>simple a derecha</td></tr><tr><td>−2</td><td>+1</td><td>Izquierda-Derecha</td><td>doble a derecha: simple a izquierda sobre el hijo y simple a derecha sobre el nodo</td></tr></tbody></table></div>',
  simple:'Se busca el nodo <b>más bajo</b> que quedó con |FE| = 2 (volviendo desde el punto de inserción hacia la raíz) y se rota ahí. Los signos del nodo y de su hijo van en el mismo sentido → rotación simple; en sentidos opuestos → doble.',
  ej:'<b>Insertar 30, 20, 10, 40, 50:</b><ol><li>30, 20: sin problema. Se inserta 10: FE(30) = −2 y su hijo 20 tiene FE −1 → Izquierda-Izquierda → <b>rotación simple a derecha</b> sobre 30 → 20(10, 30).</li><li>Se inserta 40: sin problema → 20(10, 30(−, 40)).</li><li>Se inserta 50: FE(30) = +2 y su hijo 40 tiene FE +1 → Derecha-Derecha → <b>rotación simple a izquierda</b> sobre 30 → 20(10, 40(30, 50)).</li></ol>Resultado: <b>20(10, 40(30, 50))</b>, con dos rotaciones simples y ninguna doble. Podés repetirlo en la pestaña <b>Árboles</b>.',
  warn:'Las rotaciones conservan el orden de un ABB (el inorden no cambia). Después de rotar hay que actualizar las alturas.' },
{ id:'avl-abb', prio:'alta', t:'ABB vs AVL: comparación', uso:'ABB / AVL · Agosto 2026 y final corregido',
  def:'<div class="tbl"><table><thead><tr><th></th><th>ABB</th><th>AVL</th></tr></thead><tbody><tr><th>Propiedad</th><td>izq &lt; nodo &lt; der</td><td>la del ABB + |FE| ≤ 1 en todo nodo</td></tr><tr><th>Altura</th><td>entre log₂ n y n</td><td>siempre O(log n) (≈ 1,44 · log₂ n como máximo)</td></tr><tr><th>Búsqueda</th><td>O(h): O(n) en el peor caso</td><td>O(log n) garantizado</td></tr><tr><th>Inserción</th><td>O(h), simple</td><td>O(log n): inserta como ABB + verifica balance y rota</td></tr><tr><th>Eliminación</th><td>O(h), 3 casos</td><td>O(log n): como ABB + rebalancea</td></tr><tr><th>Código</th><td>más simple</td><td>más extenso y con rotaciones</td></tr><tr><th>Conviene</th><td>pocos datos, claves en orden aleatorio, simplicidad</td><td>muchas búsquedas, claves que pueden llegar ordenadas, necesito garantía de tiempo</td></tr></tbody></table></div>',
  simple:'Insertar 10, 20, 30, 40, 50: el ABB queda como una lista (altura 5, buscar es O(n)). El AVL queda 20(10, 40(30, 50)) (altura 3).',
  ej:'',
  warn:'Cuando piden "justifique", fundamentá con la altura: todo el costo de un ABB depende de <i>h</i>, y el AVL es lo que acota <i>h</i>.' },
{ id:'avl-del', prio:'baja', t:'Eliminar en un AVL', uso:'TP5',
  def:'Se elimina como en un ABB (hoja, un hijo, o dos hijos con el sucesor) y después, volviendo hacia la raíz, se recalculan alturas y FE y se rota donde |FE| = 2. A diferencia de la inserción, <b>una eliminación puede necesitar más de una rotación</b> (una por cada nodo desbalanceado en el camino).',
  simple:'Si el hijo del nodo desbalanceado tiene FE = 0, se usa la rotación simple (en la inserción eso no ocurre).',
  ej:'', warn:'Las secuencias del TP5 se pueden simular en la pestaña <b>Árboles</b> (cargá las inserciones y después las eliminaciones). El simulador reemplaza por el mínimo del subárbol derecho, como el código de la cátedra.' },

/* ---------- ÁRBOLES B ---------- */
{ id:'arbol-b', prio:'media', t:'Árbol B: propiedades, orden m y por qué sirve para disco', uso:'Árboles B · 5 de 8 finales',
  def:'Árbol de búsqueda m-ario balanceado: cada nodo tiene como máximo <b>m hijos y m − 1 claves</b>; la raíz es una hoja o tiene al menos 2 hijos; cada nodo interno (que no es raíz) tiene entre ⌈m/2⌉ y m hijos; <b>todas las hojas están al mismo nivel</b>. El orden m lo determina la cantidad máxima de hijos por nodo.',
  simple:'<div class="tbl"><table><thead><tr><th>Orden m</th><th>Máx. claves</th><th>Mín. claves (no raíz)</th><th>Mín. hijos (no raíz)</th></tr></thead><tbody><tr><td>3</td><td>2</td><td>1</td><td>2</td></tr><tr><td>4</td><td>3</td><td>1</td><td>2</td></tr><tr><td>5</td><td>4</td><td>2</td><td>3</td></tr><tr><td>6</td><td>5</td><td>2</td><td>3</td></tr></tbody></table></div><p><b>Por qué para disco:</b> el cuello de botella es el acceso a disco (miles de veces más lento que la RAM). Cada nodo de un B ocupa un bloque de disco y guarda muchas claves, así que el árbol es muy bajo (3 o 4 niveles con millones de registros). Un AVL de 1.000.000 de claves tiene unos 20 niveles, o sea unas 20 lecturas. El B también se mantiene balanceado a bajo costo.</p>',
  ej:'Mínimo de claves de un nodo no raíz = ⌈m/2⌉ − 1. Con m = 5: ⌈5/2⌉ − 1 = 2 claves y 3 hijos como mínimo.',
  warn:'Operaciones: <b>inserción</b> en la hoja; si el nodo se excede, se <b>divide</b> (la mediana sube al padre) y puede propagarse hasta la raíz. <b>Eliminación</b>: se quita la clave (si es interna, se cambia por su predecesor o sucesor); si el nodo queda por debajo del mínimo, se intenta <b>redistribuir</b> con un hermano que tenga claves de sobra y, si no se puede, se <b>fusiona</b> con un hermano bajando una clave del padre.' },
{ id:'b-var', prio:'media', t:'B, B* y B+: diferencias', uso:'Árboles B · Modelo General',
  def:'<div class="tbl"><table><thead><tr><th>Característica</th><th>B</th><th>B*</th><th>B+</th></tr></thead><tbody><tr><td>Claves en nodos internos</td><td>Sí</td><td>Sí</td><td>No (solo guían la búsqueda)</td></tr><tr><td>Datos en las hojas</td><td>Sí</td><td>Sí</td><td>Sí, todos</td></tr><tr><td>Llenado mínimo</td><td>≈ 1/2</td><td>≈ 2/3</td><td>≈ 1/2</td></tr><tr><td>Redistribuye antes de dividir</td><td>No</td><td>Sí</td><td>—</td></tr><tr><td>Hojas enlazadas entre sí</td><td>No</td><td>No</td><td>Sí</td></tr><tr><td>Ideal para</td><td>archivos</td><td>discos densos</td><td>bases de datos e índices</td></tr></tbody></table></div>',
  simple:'<b>B+</b>: como las hojas están enlazadas y guardan todos los datos, permite <b>recorrer en orden</b> y consultar <b>rangos</b> de forma eficiente sin volver a subir por el árbol. Por eso es el que se elige cuando piden búsqueda por clave <b>más</b> recorrido ordenado en disco. <b>B*</b>: ocupa mejor el espacio (nodos al menos 2/3 llenos) porque redistribuye con el hermano antes de dividir.',
  ej:'Sistemas de archivos (NTFS, ext4), índices de MySQL, PostgreSQL y Oracle.',
  warn:'No confundas: la tabla hash no sirve para el recorrido ordenado en disco (no conserva el orden) y el AVL está pensado para memoria principal.' },

/* ---------- HASH ---------- */
{ id:'hash', prio:'alta', t:'Tabla hash y función de dispersión', uso:'Hash · 7 de 8 finales',
  def:'Una tabla hash asocia claves con valores. Se compone de un <b>arreglo</b> de entradas y una <b>función hash</b> que transforma la clave en una posición del arreglo. Está pensada para acelerar la <b>búsqueda por clave</b>: búsqueda, inserción y eliminación son O(1) en promedio.',
  simple:'<b>La función de dispersión es crítica</b> porque de ella depende cuántas colisiones hay: debe ser <b>rápida</b>, <b>determinista</b> (misma clave, misma posición) y <b>distribuir uniformemente</b>. Una mala función amontona claves en pocas posiciones y la búsqueda se degrada hasta O(n).<br><b>Método de la división:</b> h(k) = k mod m, con m primo y no cercano a potencias de 2 o de 10. <b>Multiplicación:</b> h(k) = ⌊m · (A·k mod 1)⌋ con A ≈ 0,618. <b>Bernstein</b> (cadenas): hash = hash · 33 + c, empezando en 5381.',
  ej:'h(k) = k mod 11: h(22) = 0, h(15) = 4, h(37) = 4 → colisión con el 15.',
  warn:'La tabla hash <b>no mantiene el orden</b>: no sirve cuando también piden un listado ordenado por clave ni recorridos en rango.' },
{ id:'colisiones', prio:'alta', t:'Colisiones y cómo resolverlas', uso:'Hash · 6 de 8 finales',
  def:'Una <b>colisión</b> ocurre cuando dos claves distintas producen la misma posición. Es inevitable porque hay muchas más claves posibles que posiciones: la función no puede ser inyectiva.',
  simple:'<div class="tbl"><table><thead><tr><th>Técnica</th><th>Cómo funciona</th><th>Ventaja</th><th>Desventaja</th></tr></thead><tbody><tr><td><b>Encadenamiento</b> (hash abierta)</td><td>cada posición guarda una lista con las claves que colisionan</td><td>nunca se llena; eliminar es simple; tolera α &gt; 1</td><td>memoria extra de punteros; listas largas si α es alto</td></tr><tr><td><b>Sondeo lineal</b> (hash cerrada)</td><td>prueba h, h+1, h+2, …</td><td>simple; buen rendimiento de caché</td><td>agrupamiento primario (bloques de posiciones ocupadas)</td></tr><tr><td><b>Sondeo cuadrático</b></td><td>prueba h+1², h+2², h+3², …</td><td>reduce el agrupamiento primario</td><td>más complejo; puede no recorrer toda la tabla</td></tr><tr><td><b>Doble hash</b></td><td>h₁(k) + i · h₂(k) con una segunda función</td><td>reduce mucho los agrupamientos</td><td>más cálculo; h₂ nunca puede dar 0</td></tr></tbody></table></div>',
  ej:'<b>Hash cerrada</b>: cada posición guarda un único elemento y las colisiones se resuelven buscando otra posición libre dentro de la tabla. <b>Hash abierta</b>: las colisiones se resuelven agregando el elemento a una estructura auxiliar (lista) en la misma posición.',
  warn:'En una hash cerrada, al eliminar no se deja la posición vacía (rompería la búsqueda de las claves que pasaron por ahí): se marca como "borrada".' },
{ id:'carga', prio:'alta', t:'Factor de carga y redimensionamiento (rehashing)', uso:'Hash · Julio 2025, Modelo, Agosto 2026',
  def:'<b>Factor de carga α = n / m</b> (elementos almacenados sobre tamaño de la tabla). Mide qué tan llena está. Con encadenamiento el largo promedio de las listas es α; con direccionamiento abierto α no puede pasar de 1 y el rendimiento cae mucho al acercarse.',
  simple:'<div class="tbl"><table><thead><tr><th>α</th><th>Riesgo de agrupamiento</th><th>Consecuencia</th></tr></thead><tbody><tr><td>Bajo (&lt; 0,5)</td><td>bajo</td><td>buena dispersión</td></tr><tr><td>Medio (0,5 – 0,7)</td><td>moderado</td><td>empiezan los agrupamientos</td></tr><tr><td>Alto (&gt; 0,7)</td><td>alto</td><td>zonas densas, mal rendimiento</td></tr></tbody></table></div><p><b>Redimensionar (rehashing):</b> cuando α supera el límite se crea una tabla más grande (por ejemplo el doble, y primo) y se <b>recalcula la posición de cada elemento</b> con el nuevo tamaño m (no se copian las posiciones, porque h depende de m). Cuesta O(n) una vez, pero baja α y las colisiones.</p>',
  ej:'Capacidad 100, 75 elementos: α = 75 / 100 = <b>0,75</b> → alto: la búsqueda e inserción se degradan (más colisiones, más sondeos o listas más largas) y conviene redimensionar.',
  warn:'Si piden "consecuencias de que α aumente mucho": más colisiones, búsquedas e inserciones más lentas (tienden a O(n)) y, en hash cerrada, la tabla puede llenarse y no poder insertar.' },
{ id:'hash-ej', prio:'alta', t:'Ejercicio tipo: insertar claves a mano (Modelo General)', uso:'Hash · simulador en la pestaña Hash',
  def:'Tabla de tamaño 11, h(k) = k mod 11, claves 22, 15, 37, 48, 59: 22 → 0, 15 → 4, 37 → 4, 48 → 4, 59 → 4.',
  simple:'<div class="tbl"><table><thead><tr><th>Método</th><th>Estado final</th></tr></thead><tbody><tr><td>Hash abierta (encadenamiento)</td><td><code>0: 22</code> · <code>4: 15 → 37 → 48 → 59</code> (el resto vacío)</td></tr><tr><td>Hash cerrada, sondeo lineal</td><td><code>0: 22</code> · <code>4: 15</code> · <code>5: 37</code> · <code>6: 48</code> · <code>7: 59</code></td></tr></tbody></table></div>',
  ej:'Con sondeo lineal, el 37 prueba 4 (ocupado) y queda en 5; el 48 prueba 4 y 5 y queda en 6; el 59 prueba 4, 5 y 6 y queda en 7. Para esta tabla α = 5/11 ≈ 0,45.',
  warn:'Mostrá la <b>cuenta</b> de cada clave (k mod 11) y la secuencia de posiciones probadas: el final se corrige con el estado de la tabla, pero los puntos se ganan con el procedimiento.' },

/* ---------- GRAFOS ---------- */
{ id:'grafo', prio:'alta', t:'Grafos: definición y propiedades', uso:'Grafos · 8 de 8 finales',
  def:'Un grafo G = (V, A) es un conjunto de <b>vértices</b> y un conjunto de <b>aristas</b> (pares de vértices) que modela relaciones muchos a muchos. <b>No dirigido:</b> {u, v} = {v, u}. <b>Dirigido:</b> (u, v) ≠ (v, u) (arcos). <b>Ponderado:</b> las aristas tienen un valor (distancia, costo, tiempo).',
  simple:'<ul><li><b>Adyacentes:</b> unidos por una arista. <b>Camino:</b> sucesión de vértices adyacentes; su longitud es la cantidad de aristas.</li><li><b>Conexo:</b> hay camino entre todo par de vértices (en un dirigido, <b>fuertemente conexo</b> si hay camino en ambos sentidos entre todo par). <b>Ciclo:</b> camino que vuelve al inicio; <b>acíclico:</b> sin ciclos.</li><li><b>Completo:</b> todos conectados con todos. <b>Denso:</b> le faltan pocas aristas para ser completo. <b>Disperso:</b> pocas aristas.</li><li><b>Camino hamiltoniano:</b> pasa por cada <b>vértice</b> una sola vez. <b>Camino euleriano:</b> pasa por cada <b>arista</b> una sola vez.</li><li>Euler: un grafo no dirigido tiene camino euleriano si es conexo y tiene 0 o 2 vértices de grado impar (ciclo euleriano si todos son pares).</li></ul>',
  ej:'<b>Julio 2025</b> (A→B, A→C, B→D, C→D, D→A, D→E): <b>no</b> es fuertemente conexo (de E no sale ningún arco); <b>tiene ciclo</b> A→B→D→A; <b>no</b> tiene camino hamiltoniano (B y C solo llevan a D y no están unidos entre sí, así que no se puede pasar por los dos).',
  warn:'Para justificar "no es fuertemente conexo" buscá un vértice sin arcos de salida (o sin arcos de entrada). Para "es hamiltoniano" alcanza con mostrar el camino. Podés probar grafos propios en la pestaña <b>Grafos</b>.' },
{ id:'grafo-repr', prio:'alta', t:'Matriz vs lista de adyacencia (siempre sale)', uso:'Grafos · 6 de 8 finales',
  def:'<b>Matriz de adyacencia:</b> matriz n × n; A[i][j] = 1 si hay arista de i a j (o el peso en un grafo ponderado). <b>Lista de adyacencia:</b> un arreglo con un elemento por vértice, cada uno con la lista enlazada de sus vecinos.',
  simple:'<div class="tbl"><table><thead><tr><th></th><th>Matriz</th><th>Lista</th></tr></thead><tbody><tr><th>Memoria</th><td>O(n²) siempre</td><td>O(n + m)</td></tr><tr><th>¿Son adyacentes u y v?</th><td>O(1)</td><td>O(grado de u)</td></tr><tr><th>Recorrer los vecinos de u</th><td>O(n)</td><td>O(grado de u)</td></tr><tr><th>Recorrer todo el grafo</th><td>O(n²)</td><td>O(n + m)</td></tr><tr><th>Conviene</th><td>grafos densos; consulta de adyacencia frecuente</td><td>grafos dispersos; recorridos</td></tr></tbody></table></div>',
  ej:'<b>Red de 5.000 vértices con 3 conexiones cada uno:</b> es un grafo <b>disperso</b> (3 de 4.999 posibles). Matriz: 5.000² = 25.000.000 de celdas. Lista: unas 5.000 + 15.000 entradas. → lista de adyacencia. <b>10.000 computadoras con 4 o 5 conexiones:</b> matriz 100.000.000 de celdas vs. unas 50.000 entradas en la lista.',
  warn:'La pregunta clásica: "complejidad de comprobar si dos vértices son adyacentes y si puede mejorarse con otra representación". Con lista es O(grado de u) (peor caso O(n)); con <b>matriz es O(1)</b>, a costa de O(n²) de memoria.' },
{ id:'bfs-dfs', prio:'alta', t:'Recorridos: BFS (cola) y DFS (pila)', uso:'Grafos · 5 finales',
  def:'<b>BFS (anchura):</b> visita primero todos los vecinos del vértice inicial, después los del siguiente nivel; usa una <b>cola</b>. <b>DFS (profundidad):</b> avanza por un camino hasta el fondo y retrocede; usa una <b>pila</b> (explícita o la de la recursión). Con lista de adyacencia los dos cuestan O(n + m); con matriz, O(n²).',
  simple:'<b>Camino con la menor cantidad de conexiones (aristas):</b> BFS, porque explora por niveles y llega a cada vértice por el camino más corto en cantidad de aristas. DFS no lo garantiza. <b>¿Existe camino entre dos vértices?</b> BFS o DFS desde el origen y ver si se visita el destino.',
  ej:'Julio 2025, desde A, vecinos en orden alfabético: <b>BFS = A, B, C, D, E</b> · <b>DFS = A, B, D, E, C</b> (de A a B, de B a D, de D a E —A ya está visitado—, retrocede hasta A y sigue con C).',
  warn:'El orden de visita depende del orden de los vecinos: aclará el que usás ("en orden alfabético" o "en orden de la lista de adyacencia").' },
{ id:'dijkstra', prio:'alta', t:'Camino mínimo: Dijkstra, Bellman-Ford y Floyd-Warshall', uso:'Grafos · Julio 2026, Agosto 2026, Marzo',
  def:'<b>Dijkstra:</b> camino más corto desde un vértice a todos los demás en un grafo con pesos <b>no negativos</b>. Pone todas las distancias en ∞ (0 en el origen), toma siempre el vértice no procesado más cercano (cola de prioridad) y actualiza las distancias de sus vecinos si mejora. Complejidad O((n + m) log n). <b>Bellman-Ford:</b> acepta pesos negativos y detecta ciclos negativos, es más lento. <b>Floyd-Warshall:</b> todos los pares, programación dinámica, O(n³) tiempo y O(n²) espacio.',
  simple:'Si cada ruta tiene una <b>distancia</b> y piden el camino de <b>menor distancia</b>, BFS ya no sirve (cuenta aristas, no pesos): se usa Dijkstra. Si solo piden la menor cantidad de conexiones, BFS alcanza.',
  ej:'Ferrocarril de Julio 2026 (estaciones = vértices, vías = aristas ponderadas, miles de estaciones con pocas conexiones): representación con <b>lista de adyacencia</b> (grafo disperso) y <b>Dijkstra</b> para el recorrido de menor distancia.',
  warn:'Dijkstra no funciona con pesos negativos. Podés ver los pasos en la pestaña <b>Grafos</b> (cargá aristas con peso: <code>A B 4</code>).' }
];

/* ============ PLAN DE ESTUDIO ============ */
/* ordenado por lo que más pesa en los finales; sesiones de unos 90 minutos */
DATA.plan = [
  ['Sesión 1', 'Complejidad y T(n)', 'Tarjetas de Análisis. Pestaña <b>Complejidad</b>: 15 códigos del generador sin mirar la explicación. Rehacé el Fibonacci (T(n) y O(2ⁿ)).'],
  ['Sesión 2', 'Recursión y funciones sobre listas y árboles', 'Tarjetas de Recursión. Escribí a mano contar elementos, contar pares, contar nodos y contar hojas (caso base, caso recursivo, O(n)).'],
  ['Sesión 3', 'ABB y AVL', 'Tarjetas de Árboles. Pestaña <b>Árboles</b>: insertá 30, 20, 10, 40, 50 y las secuencias del TP5; practicá "¿es AVL?" con FE nodo por nodo. Escribí la búsqueda recursiva e iterativa.'],
  ['Sesión 4', 'Hash y casos', 'Tarjetas de Hash. Pestaña <b>Hash</b>: insertá a mano y verificá. Pestaña <b>Casos</b>: respondé cada escenario antes de mirar la respuesta.'],
  ['Sesión 5', 'Grafos', 'Tarjetas de Grafos. Pestaña <b>Grafos</b>: BFS, DFS y Dijkstra en los grafos de los finales. Lista vs matriz con números.'],
  ['Sesión 6', 'Simulacro y repaso', '<b>Simulacro</b> completo con tiempo. Después TAD, pila / cola / lista y árbol B (las preguntas conceptuales cortas) y las advertencias naranjas de cada tarjeta.']
];
