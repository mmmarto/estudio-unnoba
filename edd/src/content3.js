/* content3.js — TPs resueltos (generado con scripts de apoyo: los árboles se calcularon ejecutando el código de lib.js) */
DATA.tps = [
 {
  "id": "tp1",
  "nombre": "TP1 · Análisis de algoritmos",
  "intro": "",
  "items": [
   {
    "n": "1a",
    "q": "<code>buscar</code> (búsqueda lineal): T(n) en el peor caso y orden.",
    "a": "<p>Peor caso: el elemento no está (o es el último) → el ciclo hace n comparaciones. <b>T(n) = n</b> (más constantes por la inicialización y el <code>return</code>) → <b>O(n)</b>.</p>"
   },
   {
    "n": "1b",
    "q": "¿Podemos decir que también es O(n²)?",
    "a": "<p><b>Sí</b>, porque O es una cota superior y n ≤ n² para todo n ≥ 1. Es una cota válida pero floja: la cota ajustada es O(n).</p>"
   },
   {
    "n": "1c",
    "q": "¿Podemos decir que también es O(log₂ n)?",
    "a": "<p><b>No.</b> En el peor caso hay que revisar los n elementos, y log₂ n crece mucho más despacio que n: ninguna constante hace que c · log₂ n ≥ n para n grande. (La búsqueda binaria sí es O(log n), pero necesita el arreglo ordenado.)</p>"
   },
   {
    "n": "1d",
    "q": "¿Podemos decir que también es O(1)?",
    "a": "<p><b>No.</b> La cantidad de pasos depende de n (en el peor caso crece con n); O(1) significa que no depende del tamaño de la entrada.</p>"
   },
   {
    "n": 2,
    "q": "Un algoritmo O(n²) y otro O(2ⁿ): ¿cuál usaría?",
    "a": "<p>El <b>O(n²)</b>. Un crecimiento polinomial es muchísimo menor que uno exponencial para n grande: con n = 50, n² = 2.500 y 2ⁿ ≈ 1,1 · 10¹⁵. Con n = 100 el exponencial es inabordable.</p>"
   },
   {
    "n": "3a",
    "q": "<code>ejemplo1(n)</code>: un ciclo.",
    "a": "<p>El <code>Println</code> se ejecuta n veces → <b>T(n) = n → O(n)</b>.</p>"
   },
   {
    "n": "3b",
    "q": "<code>ejemplo2(n, m)</code>: dos ciclos en secuencia.",
    "a": "<p>Ciclos en secuencia: se suman. <b>T(n, m) = n + m → O(n + m)</b> (si m ≤ n, es O(n)).</p>"
   },
   {
    "n": "3c",
    "q": "<code>ejemplo3(n)</code>: dos ciclos anidados independientes.",
    "a": "<p>El interno hace n vueltas por cada una de las n del externo: <b>T(n) = n · n = n² → O(n²)</b>.</p>"
   },
   {
    "n": "3d",
    "q": "<code>ejemplo4(n)</code>: el interno arranca en <code>i</code>.",
    "a": "<p>Para i = 0 el interno hace n vueltas, para i = 1 hace n − 1, …, para i = n − 1 hace 1: <b>T(n) = n + (n−1) + … + 1 = n(n+1)/2 → O(n²)</b>.</p>"
   },
   {
    "n": 4,
    "q": "Si en el ejercicio 2 el tamaño de la entrada es 3, ¿cuál usaría?",
    "a": "<p>Con n = 3: n² = 9 y 2ⁿ = 8. Para tamaños muy chicos las constantes y los términos menores pesan más que el orden, así que el análisis asintótico no decide: acá el exponencial hace menos pasos. Por eso el orden recién importa cuando n crece (en n = 5: 25 contra 32; en n = 10: 100 contra 1.024).</p>"
   },
   {
    "n": 5,
    "q": "Comparaciones de la búsqueda binaria en el peor caso para n = 2, 4, …, 1024, contrastadas con la lineal.",
    "tabla": {
     "cols": [
      "n",
      "2",
      "4",
      "8",
      "16",
      "32",
      "64",
      "128",
      "256",
      "512",
      "1024"
     ],
     "rows": [
      [
       "log₂ n (orden)",
       "1",
       "2",
       "3",
       "4",
       "5",
       "6",
       "7",
       "8",
       "9",
       "10"
      ],
      [
       "Binaria, peor caso exacto (⌊log₂ n⌋ + 1)",
       "2",
       "3",
       "4",
       "5",
       "6",
       "7",
       "8",
       "9",
       "10",
       "11"
      ],
      [
       "Lineal (n)",
       "2",
       "4",
       "8",
       "16",
       "32",
       "64",
       "128",
       "256",
       "512",
       "1024"
      ]
     ]
    },
    "nota": "Cada vez que se duplica n, la binaria suma una sola comparación; la lineal también se duplica.",
    "a": "<p>La binaria crece con el logaritmo: con 1.024 elementos hacen falta unas 10 comparaciones (11 contando la última) contra 1.024 de la lineal. Pero exige el arreglo ordenado.</p>"
   },
   {
    "n": 6,
    "q": "¿Qué es mejor, O(n) o O(n/2)? ¿Tiene sentido hablar de O(n/2) y de O(n + 4)?",
    "a": "<p>Son <b>lo mismo</b>: O(n/2) = O(n) y O(n + 4) = O(n). No tiene sentido escribirlos así porque la notación O descarta las constantes multiplicativas y los términos menores: dependen de la máquina y no cambian la forma de crecimiento.</p>"
   }
  ]
 },
 {
  "id": "tp2",
  "nombre": "TP2 · Estructuras lineales",
  "intro": "",
  "items": [
   {
    "n": 1,
    "q": "Para cola, lista enlazada, lista doblemente enlazada y cola doblemente terminada: características, operaciones con sentido, sin sentido y no indispensables.",
    "tabla": {
     "cols": [
      "Estructura",
      "Características",
      "Operaciones con sentido",
      "Sin sentido",
      "Con sentido pero no indispensables"
     ],
     "rows": [
      [
       "Cola",
       "lineal, tamaño dinámico, homogénea, acceso restringido (se inserta al final, se saca del frente), FIFO",
       "encolar, desencolar, frente, es_vacía",
       "insertar o eliminar en el medio, acceder a la posición i",
       "tamaño, vaciar, copiar"
      ],
      [
       "Lista enlazada",
       "lineal, dinámica, homogénea, acceso secuencial desde el primer nodo",
       "insertar y eliminar en una posición, consultar una posición, buscar, es_vacía, longitud",
       "\"apilar\" o \"desencolar\" (son de pila y cola)",
       "invertir, concatenar, ordenar"
      ],
      [
       "Lista doble",
       "como la lista, con puntero al anterior y al siguiente; acceso en ambos sentidos",
       "las de la lista + recorrer hacia atrás y eliminar un nodo teniéndolo en mano en O(1)",
       "operaciones propias de pila y cola",
       "invertir (intercambiar punteros), concatenar"
      ],
      [
       "Cola doblemente terminada (deque)",
       "lineal dinámica; se inserta y se saca por <b>ambos</b> extremos",
       "encolar y desencolar por el frente y por el final, frente, final, es_vacía",
       "acceder o insertar en el medio",
       "tamaño, vaciar"
      ]
     ]
    },
    "a": ""
   },
   {
    "n": "2a",
    "q": "Revisar la especificación del TAD Pila: errores de estructura, redacción, categorización e inconsistencias.",
    "a": "<ul><li><b>Igualdad observacional:</b> \"tienen los mismos elementos\" no alcanza: hace falta el <b>mismo orden</b> y el mismo tamaño (dos pilas con los mismos elementos en otro orden no son iguales).</li><li><b>Categorización:</b> <code>apilar</code> modifica la pila y <b>no es un observador</b>: va en \"Otras operaciones\". Los observadores solo consultan (tamaño, tope, es_vacía). <code>es_vacía</code> es un observador y estaba en \"Otras\".</li><li><b>apilar</b> devuelve <code>None</code> y su postcondición \"la pila no está vacía\" es correcta, pero debería indicar que el tope es el elemento apilado y que el tamaño aumentó en 1.</li><li><b>desapilar</b> devuelve una Pila pero en los axiomas \"quita el elemento\" (no dice qué retorna): es inconsistente. Hay que decidir si retorna el elemento o modifica la pila, y definir bien su postcondición.</li><li><b>tope:</b> \"retorna el primer elemento\" es ambiguo: debe ser el <b>último apilado</b>.</li><li><b>a_partir_de:</b> su postcondición debe aclarar el <b>orden</b> (qué elemento de la secuencia queda en el tope).</li><li><b>Axiomas:</b> son descripciones en prosa; la teoría pide axiomas que definan el comportamiento (por ejemplo tope(apilar(P, x)) = x, desapilar(apilar(P, x)) = P).</li><li><b>Exporta:</b> faltó <code>es_vacia</code>, y <code>Natural</code> no es una operación del TAD (es un tipo que se usa): no corresponde exportarlo.</li></ul>"
   },
   {
    "n": "2b",
    "q": "Proponer una versión corregida y justificar los cambios.",
    "a": "<pre><code>TAD Pila&lt;a&gt;\nIgualdad observacional\n    Dos pilas p y q son iguales si tienen el mismo tamaño y, desapilando\n    ambas, se obtienen los mismos elementos en el mismo orden.\nUsa: Natural, Bool, Secuencia&lt;a&gt;\nParámetro formal: a\nGéneros: Pila&lt;a&gt;\nObservadores básicos\n    tamaño(Pila&lt;a&gt;) → Natural\n    es_vacia(Pila&lt;a&gt;) → Bool\n    tope(Pila&lt;a&gt; p) → a                {Pre: no es_vacia(p)}\nGeneradores\n    vacia() → Pila&lt;a&gt;                   {Pos: es_vacia(retorno)}\n    a_partir_de(Secuencia&lt;a&gt; s) → Pila&lt;a&gt;\n                                         {Pos: se apilan los elementos de s en orden;\n                                              el último de s queda en el tope}\nOtras operaciones\n    apilar(Pila&lt;a&gt; p, a x)              {Pos: tope(p) = x, tamaño(p) = tamaño(p antes) + 1}\n    desapilar(Pila&lt;a&gt; p) → a            {Pre: no es_vacia(p)}\n                                         {Pos: retorna el tope anterior;\n                                              tamaño(p) = tamaño(p antes) − 1}\nAxiomas\n    tope(apilar(p, x)) = x\n    tamaño(vacia()) = 0 ; es_vacia(vacia()) = verdadero\n    tamaño(apilar(p, x)) = tamaño(p) + 1\n    desapilar(apilar(p, x)) devuelve x y deja la pila igual a p\nExporta: vacia, a_partir_de, es_vacia, tope, tamaño, apilar, desapilar</code></pre><p>Cada cambio responde a un punto de 2a: igualdad con orden, observadores solo de consulta, apilar y desapilar como operaciones que modifican, precondiciones donde hacen falta, axiomas que dicen el comportamiento y una lista de exportadas completa.</p>"
   },
   {
    "n": 3,
    "q": "Especificar con la plantilla de la cátedra: lista enlazada, lista doblemente enlazada y fecha.",
    "a": "<p>Estructura de la especificación (misma plantilla que la pila corregida):</p><ul><li><b>Lista&lt;a&gt;</b> · Observadores: <code>longitud(Lista)→Natural</code>, <code>es_vacia(Lista)→Bool</code>, <code>consultar(Lista, Natural pos)→a {Pre: 0 ≤ pos &lt; longitud}</code> · Generadores: <code>vacia()</code> · Otras: <code>insertar(Lista, Natural pos, a) {Pre: 0 ≤ pos ≤ longitud}</code>, <code>eliminar(Lista, Natural pos) {Pre: 0 ≤ pos &lt; longitud}</code> · Igualdad: misma longitud y mismos elementos en el mismo orden.</li><li><b>Lista doblemente enlazada:</b> la misma especificación más el recorrido hacia atrás: <code>consultar_anterior(Lista, pos)</code> y <code>recorrer_inverso</code>. La doble enlazada es una <b>implementación</b>, así que el TAD solo cambia si se agregan operaciones propias.</li><li><b>Fecha</b> · Usa: Natural, Bool · Observadores: <code>dia, mes, año(Fecha)→Natural</code>, <code>es_bisiesto(Fecha)→Bool</code> · Generadores: <code>crear(día, mes, año)→Fecha {Pre: la fecha existe en el calendario}</code> · Otras: <code>sumar_dias(Fecha, Natural)→Fecha</code>, <code>diferencia(Fecha, Fecha)→Entero</code>, <code>es_anterior(Fecha, Fecha)→Bool</code> · Igualdad: mismo día, mes y año.</li></ul>"
   },
   {
    "n": 4,
    "q": "Especificar e implementar el TAD Cola. Justificar la estructura interna y dar el orden de cada operación.",
    "a": "<p>Especificación: observadores <code>frente</code>, <code>es_vacia</code>, <code>tamaño</code>; generador <code>vacia</code>; otras <code>encolar</code>, <code>desencolar</code>. <b>Estructura interna: nodos enlazados con punteros al frente y al final</b> (no se conoce la cantidad de elementos; con solo el puntero al frente, encolar sería O(n)).</p><pre><code>type Nodo struct { valor int; sig *Nodo }\ntype Cola struct { frente, final *Nodo; tam int }\nfunc (c *Cola) Encolar(v int) {\n\tn := &amp;Nodo{valor: v}\n\tif c.final == nil { c.frente = n } else { c.final.sig = n }\n\tc.final = n\n\tc.tam++\n}\n\ntype Cola struct { frente, final *Nodo; tam int }\nfunc (c *Cola) Encolar(v int) {\n\tn := &amp;Nodo{valor: v}\n\tif c.final == nil { c.frente = n } else { c.final.sig = n }\n\tc.final = n\n\tc.tam++\n}\n\nfunc (c *Cola) Encolar(v int) {\n\tn := &amp;Nodo{valor: v}\n\tif c.final == nil { c.frente = n } else { c.final.sig = n }\n\tc.final = n\n\tc.tam++\n}\n\nfunc (c *Cola) Desencolar() (int, bool) {\n\tif c.frente == nil { return 0, false }\n\tv := c.frente.valor\n\tc.frente = c.frente.sig\n\tif c.frente == nil { c.final = nil }\n\tc.tam--\n\treturn v, true\n}\n\nfunc (c *Cola) Frente() (int, bool) { if c.frente == nil { return 0, false }; return c.frente.valor, true }\nfunc (c *Cola) EsVacia() bool { return c.frente == nil }\nfunc (c *Cola) Tamano() int { return c.tam }\n\n// pila con nodos\ntype nodoP struct { valor rune; sig *nodoP }\ntype Pila struct { tope *nodoP; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodoP{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc (c *Cola) EsVacia() bool { return c.frente == nil }\nfunc (c *Cola) Tamano() int { return c.tam }\n\n// pila con nodos\ntype nodoP struct { valor rune; sig *nodoP }\ntype Pila struct { tope *nodoP; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodoP{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc (c *Cola) Tamano() int { return c.tam }\n\n// pila con nodos\ntype nodoP struct { valor rune; sig *nodoP }\ntype Pila struct { tope *nodoP; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodoP{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}</code></pre><div class=\"tbl\"><table><thead><tr><th>Operación</th><th>Orden</th></tr></thead><tbody><tr><td>Encolar</td><td>O(1)</td></tr><tr><td>Desencolar</td><td>O(1)</td></tr><tr><td>Frente</td><td>O(1)</td></tr><tr><td>EsVacia</td><td>O(1)</td></tr><tr><td>Tamano</td><td>O(1) (hay un contador)</td></tr></tbody></table></div>"
   },
   {
    "n": 5,
    "q": "¿Qué condiciones son necesarias para que <code>longitud</code> sea de orden constante en una pila y en una cola?",
    "a": "<p>Que la estructura <b>guarde un contador</b> con la cantidad de elementos, que se incrementa en cada apilar o encolar y se decrementa en cada desapilar o desencolar. Así la longitud se lee en O(1) sin recorrer. (En la pila con arreglo ya es el índice del tope + 1. Con nodos y sin contador, la longitud sería O(n).)</p>"
   },
   {
    "n": 6,
    "q": "Programa que lee 10 números y los imprime en orden inverso. ¿Qué estructura y por qué?",
    "a": "<p><b>Pila</b> (LIFO): el último que entra es el primero que sale, que es el orden inverso. Se apilan los 10 números y después se desapila imprimiendo. Cada operación es O(1): en total O(n).</p><pre><code>func invertir10() {\n    var p Pila               // pila de enteros (con arreglo o nodos)\n    for i := 0; i &lt; 10; i++ {\n        var x int\n        fmt.Scan(&amp;x)\n        p.Apilar(x)\n    }\n    for !p.EsVacia() {\n        fmt.Println(p.Desapilar())\n    }\n}</code></pre>"
   },
   {
    "n": 7,
    "q": "Programa que lee una secuencia de caracteres e informa si es palíndromo, usando un TAD.",
    "a": "<p>Se apilan todos los caracteres; al desapilar salen en orden inverso, y se compara cada uno con el carácter original en el mismo orden de lectura. Si todos coinciden, es palíndromo. Tiempo O(n).</p><pre><code>type nodo struct { valor rune; sig *nodo }\ntype Pila struct { tope *nodo; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodo{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\ntype Pila struct { tope *nodo; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodo{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodo{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc (c *Cola) EsVacia() bool { return c.frente == nil }\nfunc (c *Cola) Tamano() int { return c.tam }\n\n// pila con nodos\ntype nodo struct { valor rune; sig *nodo }\ntype Pila struct { tope *nodo; tam int }\nfunc (p *Pila) Apilar(v rune) { p.tope = &amp;nodo{v, p.tope}; p.tam++ }\nfunc (p *Pila) Desapilar() rune { v := p.tope.valor; p.tope = p.tope.sig; p.tam--; return v }\nfunc (p *Pila) EsVacia() bool { return p.tope == nil }\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}\n\nfunc esPalindromo(s string) bool {\n\tvar p Pila\n\trs := []rune(s)\n\tfor _, r := range rs { p.Apilar(r) }\n\tfor _, r := range rs { if p.Desapilar() != r { return false } }\n\treturn true\n}</code></pre>"
   },
   {
    "n": 8,
    "q": "Implementar una cola doblemente terminada con nodos. encolar() y desencolar() en O(1).",
    "a": "<p>Nodos dobles (anterior y siguiente) y punteros al frente y al final. Como se mantienen los dos extremos y el enlace al anterior, tanto insertar como sacar por cualquier extremo es O(1) (en una lista simple, sacar del final sería O(n) porque habría que buscar el penúltimo).</p><pre><code>type Nodo struct { valor int; ant, sig *Nodo }\ntype Deque struct { frente, final *Nodo }\nfunc (d *Deque) EncolarFinal(v int) {\n\tn := &amp;Nodo{valor: v, ant: d.final}\n\tif d.final == nil { d.frente = n } else { d.final.sig = n }\n\td.final = n\n}\n\ntype Deque struct { frente, final *Nodo }\nfunc (d *Deque) EncolarFinal(v int) {\n\tn := &amp;Nodo{valor: v, ant: d.final}\n\tif d.final == nil { d.frente = n } else { d.final.sig = n }\n\td.final = n\n}\n\nfunc (d *Deque) EncolarFinal(v int) {\n\tn := &amp;Nodo{valor: v, ant: d.final}\n\tif d.final == nil { d.frente = n } else { d.final.sig = n }\n\td.final = n\n}\n\nfunc (d *Deque) EncolarFrente(v int) {\n\tn := &amp;Nodo{valor: v, sig: d.frente}\n\tif d.frente == nil { d.final = n } else { d.frente.ant = n }\n\td.frente = n\n}\n\nfunc (d *Deque) DesencolarFrente() (int, bool) {\n\tif d.frente == nil { return 0, false }\n\tv := d.frente.valor\n\td.frente = d.frente.sig\n\tif d.frente == nil { d.final = nil } else { d.frente.ant = nil }\n\treturn v, true\n}\n\nfunc (d *Deque) DesencolarFinal() (int, bool) {\n\tif d.final == nil { return 0, false }\n\tv := d.final.valor\n\td.final = d.final.ant\n\tif d.final == nil { d.frente = nil } else { d.final.sig = nil }\n\treturn v, true\n}</code></pre>"
   }
  ]
 },
 {
  "id": "tp3",
  "nombre": "TP3 · Recursión",
  "intro": "",
  "items": [
   {
    "n": "1a",
    "q": "Pila de ejecución de <code>factorial(5)</code> y cantidad de llamadas.",
    "a": "<p>Llamadas (la pila crece hasta el caso base y después se resuelve en orden inverso):</p><pre><code>factorial(5) → 5 * factorial(4)\n  factorial(4) → 4 * factorial(3)\n    factorial(3) → 3 * factorial(2)\n      factorial(2) → 2 * factorial(1)\n        factorial(1) → 1 * factorial(0)\n          factorial(0) → 1      ← caso base, tope de la pila\nvuelve: 1 → 1·1 = 1 → 2·1 = 2 → 3·2 = 6 → 4·6 = 24 → 5·24 = 120</code></pre><p><b>Llamadas totales: 6</b> (n = 5, 4, 3, 2, 1, 0), es decir n + 1. Profundidad máxima de la pila: 6 marcos. Es O(n).</p>"
   },
   {
    "n": "1b",
    "q": "Pila de <code>fibonacci(4)</code>: ¿cuántas veces se llama a <code>fibonacci(2)</code>?",
    "a": "<pre><code>fib(4)\n├─ fib(3)\n│  ├─ fib(2)\n│  │  ├─ fib(1) → 1\n│  │  └─ fib(0) → 0\n│  └─ fib(1) → 1\n└─ fib(2)\n   ├─ fib(1) → 1\n   └─ fib(0) → 0</code></pre><p><b>fibonacci(2) se llama 2 veces</b>. Llamadas totales: 9 (fib(4) =3, fib(3) = 1, fib(2) × 2, fib(1) × 3, fib(0) × 2). El árbol de llamadas casi se duplica en cada nivel: O(2ⁿ).</p>"
   },
   {
    "n": "2a",
    "q": "Cuenta regresiva (recursiva e iterativa) y orden.",
    "a": "<pre><code>func regresivaRec(n int) {\n\tif n &lt; 0 { return }\n\tfmt.Println(n)\n\tregresivaRec(n - 1)\n}\n\nfunc regresivaIter(n int) {\n\tfor i := n; i &gt;= 0; i-- { fmt.Println(i) }\n}</code></pre><p>Las dos hacen n + 1 impresiones: <b>O(n)</b>. La recursiva usa O(n) de pila; la iterativa O(1).</p>"
   },
   {
    "n": "2b",
    "q": "Suma de enteros entre un inicio y un fin.",
    "a": "<pre><code>func sumaRec(a, b int) int {\n\tif a &gt; b { return 0 }\n\treturn a + sumaRec(a+1, b)\n}\n\nfunc sumaIter(a, b int) int {\n\ts := 0\n\tfor i := a; i &lt;= b; i++ { s += i }\n\treturn s\n}</code></pre><p>Las dos: <b>O(n)</b> con n = fin − inicio + 1. (Con la fórmula de Gauss, n(a + b)/2, sería O(1).)</p>"
   },
   {
    "n": "2c",
    "q": "Cantidad de vocales y de consonantes de una cadena.",
    "a": "<pre><code>func esVocal(r rune) bool {\n\tswitch r { case 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U': return true }\n\treturn false\n}\n\nfunc esLetra(r rune) bool { return (r &gt;= 'a' &amp;&amp; r &lt;= 'z') || (r &gt;= 'A' &amp;&amp; r &lt;= 'Z') }\nfunc vocConsRec(s []rune) (int, int) {\n\tif len(s) == 0 { return 0, 0 }\n\tv, c := vocConsRec(s[1:])\n\tif esVocal(s[0]) { v++ } else if esLetra(s[0]) { c++ }\n\treturn v, c\n}\n\nfunc vocConsRec(s []rune) (int, int) {\n\tif len(s) == 0 { return 0, 0 }\n\tv, c := vocConsRec(s[1:])\n\tif esVocal(s[0]) { v++ } else if esLetra(s[0]) { c++ }\n\treturn v, c\n}\n\nfunc vocConsIter(s string) (v, c int) {\n\tfor _, r := range s {\n\t\tif esVocal(r) { v++ } else if esLetra(r) { c++ }\n\t}\n\treturn\n}</code></pre><p>Las dos: <b>O(n)</b>, con n = largo de la cadena. (En la recursiva, <code>s[1:]</code> en Go es un corte que no copia: cada llamado es O(1).)</p>"
   },
   {
    "n": "2d",
    "q": "Mayor elemento de un arreglo de enteros.",
    "a": "<pre><code>func mayorRec(a []int) int {\n\tif len(a) == 1 { return a[0] }\n\tm := mayorRec(a[1:])\n\tif a[0] &gt; m { return a[0] }\n\treturn m\n}\n\nfunc mayorIter(a []int) int {\n\tm := a[0]\n\tfor _, x := range a { if x &gt; m { m = x } }\n\treturn m\n}</code></pre><p>Las dos: <b>O(n)</b>: compara cada elemento una vez.</p>"
   },
   {
    "n": "2e",
    "q": "Invertir un arreglo de enteros.",
    "a": "<pre><code>func invertirRec(a []int, i, j int) {\n\tif i &gt;= j { return }\n\ta[i], a[j] = a[j], a[i]\n\tinvertirRec(a, i+1, j-1)\n}\n\nfunc invertirIter(a []int) {\n\tfor i, j := 0, len(a)-1; i &lt; j; i, j = i+1, j-1 { a[i], a[j] = a[j], a[i] }\n}</code></pre><p>Las dos: <b>O(n)</b> (n/2 intercambios).</p>"
   },
   {
    "n": 3,
    "q": "Búsqueda binaria recursiva en [3, 8, 15, 19, 25, 31, 42, 57, 63, 79], buscar 31.",
    "tabla": {
     "cols": [
      "Llamada",
      "inicio",
      "fin",
      "medio",
      "arr[medio]",
      "Comparación",
      "Se descarta"
     ],
     "rows": [
      [
       "1",
       "0",
       "9",
       "4",
       "25",
       "31 &gt; 25",
       "la mitad izquierda (posiciones 0 a 4)"
      ],
      [
       "2",
       "5",
       "9",
       "7",
       "57",
       "31 &lt; 57",
       "la mitad derecha (posiciones 7 a 9)"
      ],
      [
       "3",
       "5",
       "6",
       "5",
       "31",
       "31 = 31",
       "encontrado en la posición 5"
      ]
     ]
    },
    "nota": "Si el número no estuviera, el rango se vacía (inicio &gt; fin) y se retorna \"no encontrado\" (por ejemplo −1) en el caso base.",
    "a": "<p>Medio = ⌊(inicio + fin) / 2⌋. Cada llamado descarta la mitad del rango: log₂ n llamados como máximo, <b>O(log n)</b>.</p>"
   },
   {
    "n": 4,
    "q": "MergeSort de [38, 27, 43, 3, 9, 82, 10]: cómo divide y cómo combina.",
    "a": "<p><b>Divide</b> (por la mitad, hasta tener subarreglos de 1 elemento):</p><pre><code>[38 27 43 3 9 82 10]\n[38 27 43 3]        [9 82 10]\n[38 27] [43 3]      [9 82] [10]\n[38][27] [43][3]    [9][82]</code></pre><p><b>Combina</b> (cuando se llega a los casos base de un elemento, empiezan las fusiones, de abajo hacia arriba):</p><pre><code>[38][27] → [27 38]        [43][3] → [3 43]        [9][82] → [9 82]\n[27 38] + [3 43] → [3 27 38 43]     [9 82] + [10] → [9 10 82]\n[3 27 38 43] + [9 10 82] → [3 9 10 27 38 43 82]</code></pre><p><b>Fusión ordenada:</b> con un índice en cada subarreglo ya ordenado, se copia el menor de los dos elementos apuntados y se avanza ese índice; al agotarse uno, se copia el resto del otro. Cuesta O(n) por nivel y hay log₂ n niveles → <b>O(n log n)</b>.</p>"
   }
  ]
 },
 {
  "id": "tp4",
  "nombre": "TP4 · Árboles ABB",
  "intro": "Los árboles se dan en notación <code>valor(izquierdo, derecho)</code>; \"−\" es un subárbol vacío. Los resultados salen de ejecutar el código con la convención de la cátedra al eliminar un nodo con dos hijos: se reemplaza por el <b>sucesor</b> (el mínimo del subárbol derecho). Con el predecesor, algunos árboles resultantes cambian.",
  "items": [
   {
    "n": 1,
    "q": "Diferencia entre un árbol general y un árbol binario.",
    "a": "<p>En un <b>árbol general</b> cada nodo puede tener cualquier cantidad de hijos; en un <b>árbol binario</b> tiene como máximo <b>2</b> (hijo izquierdo y derecho, que se distinguen entre sí).</p>"
   },
   {
    "n": 2,
    "q": "Revisar la especificación del TAD ABB: ¿qué operaciones modificaría o agregaría?",
    "a": "<p>Propuestas razonables: <code>minimo</code> y <code>maximo</code> (el más a la izquierda y a la derecha); <code>altura</code>; <code>cantidad_nodos</code> y <code>cantidad_hojas</code>; los tres recorridos (<code>preorden</code>, <code>inorden</code>, <code>postorden</code>) retornando una secuencia; <code>es_vacio</code>; <code>eliminar</code> con sus tres casos y la precondición de que la clave exista (o que retorne un booleano); <code>sucesor</code> y <code>predecesor</code>; y aclarar en la igualdad observacional que dos ABB son iguales si tienen el mismo conjunto de claves (aunque tengan distinta forma) o la misma forma, según lo que se decida.</p>"
   },
   {
    "n": "3a",
    "q": "Construir el ABB de (20, 5, 40, 37, 45, 1, 7, 38): altura y recorridos.",
    "a": "<p><b>Árbol:</b> <code>20(5(1,7),40(37(-,38),45))</code> <span class=\"muted\">(valor(izquierdo, derecho); − es vacío)</span></p><ul><li><b>Altura:</b> 3 (en aristas; 4 niveles)</li><li><b>Preorden:</b> 20 5 1 7 40 37 38 45</li><li><b>Inorden:</b> 1 5 7 20 37 38 40 45 (ordenado: es un ABB)</li><li><b>Postorden:</b> 1 7 5 38 37 45 40 20</li></ul>"
   },
   {
    "n": "3b",
    "q": "Construir el ABB de (120, 55, 42, 35, 72, 65, 126): altura y recorridos.",
    "a": "<p><b>Árbol:</b> <code>120(55(42(35,-),72(65,-)),126)</code> <span class=\"muted\">(valor(izquierdo, derecho); − es vacío)</span></p><ul><li><b>Altura:</b> 3 (en aristas; 4 niveles)</li><li><b>Preorden:</b> 120 55 42 35 72 65 126</li><li><b>Inorden:</b> 35 42 55 65 72 120 126 (ordenado: es un ABB)</li><li><b>Postorden:</b> 35 42 65 72 55 126 120</li></ul>"
   },
   {
    "n": "3c",
    "q": "Construir el ABB de (35, 17, 4, 50, 23, 8, 30, 15, 12, 41): altura y recorridos.",
    "a": "<p><b>Árbol:</b> <code>35(17(4(-,8(-,15(12,-))),23(-,30)),50(41,-))</code> <span class=\"muted\">(valor(izquierdo, derecho); − es vacío)</span></p><ul><li><b>Altura:</b> 5 (en aristas; 6 niveles)</li><li><b>Preorden:</b> 35 17 4 8 15 12 23 30 50 41</li><li><b>Inorden:</b> 4 8 12 15 17 23 30 35 41 50 (ordenado: es un ABB)</li><li><b>Postorden:</b> 12 15 8 4 30 23 17 41 50 35</li></ul>"
   },
   {
    "n": 4,
    "q": "Para un árbol binario de altura h, ¿cuál es el máximo número de nodos?",
    "a": "<p>Con la altura medida en aristas, el nivel k (k = 0, …, h) tiene como máximo 2<sup>k</sup> nodos: 1 + 2 + 4 + … + 2<sup>h</sup> = <b>2<sup>h+1</sup> − 1</b> (suma de una serie geométrica). Contando la altura en niveles (hoja = 1), es 2<sup>h</sup> − 1. Ejemplo: h = 3 aristas → 15 nodos. Inversamente, con n nodos la altura mínima es ⌈log₂(n + 1)⌉ − 1.</p>"
   },
   {
    "n": "5a",
    "q": "Secuencia (5, 10, 8, 3, 12, 0), eliminar 0, 5.",
    "a": "<p><b>Árbol inicial:</b> <code>5(3(0,-),10(8,12))</code></p><ol><li>Eliminar <b>0</b> → <code>5(3,10(8,12))</code></li><li>Eliminar <b>5</b> → <code>8(3,10(-,12))</code></li></ol><ul><li>0 es una hoja: se quita.</li><li>5 es la raíz y tiene dos hijos: se reemplaza por su sucesor (el mínimo del subárbol derecho = 8) y se elimina el 8 de su lugar.</li></ul>"
   },
   {
    "n": "5b",
    "q": "Secuencia (50, 45, 17, 68, 99, 75, 5, 51, 78, 76), eliminar 17, 68, 50.",
    "a": "<p><b>Árbol inicial:</b> <code>50(45(17(5,-),-),68(51,99(75(-,78(76,-)),-)))</code></p><ol><li>Eliminar <b>17</b> → <code>50(45(5,-),68(51,99(75(-,78(76,-)),-)))</code></li><li>Eliminar <b>68</b> → <code>50(45(5,-),75(51,99(78(76,-),-)))</code></li><li>Eliminar <b>50</b> → <code>51(45(5,-),75(-,99(78(76,-),-)))</code></li></ol><ul><li>17 tiene un solo hijo (el 5): el hijo lo reemplaza.</li><li>68 tiene dos hijos (51 y 99): se reemplaza por el sucesor, el mínimo del subárbol derecho = 75, y se elimina el 75 (que tenía un hijo, el 78).</li><li>50 (raíz) tiene dos hijos: se reemplaza por el sucesor = 51 (el mínimo del subárbol derecho, que es una hoja).</li></ul>"
   },
   {
    "n": "5c",
    "q": "Secuencia (3, 5, 13, 43, 92, 97, 25, 41), eliminar 13, 25, 43.",
    "a": "<p><b>Árbol inicial:</b> <code>3(-,5(-,13(-,43(25(-,41),92(-,97)))))</code></p><ol><li>Eliminar <b>13</b> → <code>3(-,5(-,43(25(-,41),92(-,97))))</code></li><li>Eliminar <b>25</b> → <code>3(-,5(-,43(41,92(-,97))))</code></li><li>Eliminar <b>43</b> → <code>3(-,5(-,92(41,97)))</code></li></ol><ul><li>13 tiene un solo hijo (43): lo reemplaza.</li><li>25 tiene un solo hijo (41): lo reemplaza.</li><li>43 tiene dos hijos (41 y 92): se reemplaza por el sucesor, 92 (el mínimo del subárbol derecho), y su hijo 97 ocupa el lugar que dejó.</li></ul>"
   },
   {
    "n": 6,
    "q": "Implementar <code>buscar</code> de forma iterativa y recursiva sobre <code>ArbolBB</code>.",
    "a": "<pre><code>type ArbolBB struct {\n    valor             int\n    hijo_izq, hijo_der *ArbolBB\n}\n\nfunc (a *ArbolBB) BuscarRec(x int) *ArbolBB {\n    if a == nil || a.valor == x { return a }\n    if x &lt; a.valor { return a.hijo_izq.BuscarRec(x) }\n    return a.hijo_der.BuscarRec(x)\n}\n\nfunc (a *ArbolBB) BuscarIter(x int) *ArbolBB {\n    for a != nil &amp;&amp; a.valor != x {\n        if x &lt; a.valor { a = a.hijo_izq } else { a = a.hijo_der }\n    }\n    return a\n}</code></pre><p>Los dos retornan el nodo o <code>nil</code>. Tiempo O(h); memoria O(h) la recursiva y O(1) la iterativa. En Go, un método con receptor puntero puede llamarse sobre <code>nil</code> sin error: por eso <code>a.hijo_izq.BuscarRec(x)</code> funciona con el árbol vacío.</p>"
   }
  ]
 },
 {
  "id": "tp5",
  "nombre": "TP5 · Árboles AVL",
  "intro": "Calculado con el simulador de la pestaña <b>Árboles</b> (podés repetir cada paso ahí). Convención al eliminar un nodo con dos hijos: se reemplaza por el <b>sucesor</b> (mínimo del subárbol derecho). Notación <code>valor(izquierdo, derecho)</code>; − es vacío. FE = H(der) − H(izq).",
  "items": [
   {
    "n": "1a",
    "q": "Secuencia 1: insertar 30, 20, 10, 25, 28, 27, 40, 35, 50, 5; eliminar 25, 20, 35.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 30 → <code>30</code></li><li>Insertar 20 → <code>30(20,-)</code></li><li>Insertar 10 → <code>20(10,30)</code> · <b>Simple a derecha en 30 (FE -2)</b></li><li>Insertar 25 → <code>20(10,30(25,-))</code></li><li>Insertar 28 → <code>20(10,28(25,30))</code> · <b>Doble a derecha en 30 (FE -2)</b></li><li>Insertar 27 → <code>25(20(10,-),28(27,30))</code> · <b>Doble a izquierda en 20 (FE 2)</b></li><li>Insertar 40 → <code>25(20(10,-),28(27,30(-,40)))</code></li><li>Insertar 35 → <code>25(20(10,-),28(27,35(30,40)))</code> · <b>Doble a izquierda en 30 (FE 2)</b></li><li>Insertar 50 → <code>25(20(10,-),35(28(27,30),40(-,50)))</code> · <b>Simple a izquierda en 28 (FE 2)</b></li><li>Insertar 5 → <code>25(10(5,20),35(28(27,30),40(-,50)))</code> · <b>Simple a derecha en 20 (FE -2)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 25 → <code>27(10(5,20),35(28(-,30),40(-,50)))</code></li><li>Eliminar 20 → <code>27(10(5,-),35(28(-,30),40(-,50)))</code></li><li>Eliminar 35 → <code>27(10(5,-),40(28(-,30),50))</code></li></ol><p><b>Árbol final:</b> <code>27(10(5,-),40(28(-,30),50))</code> · altura 4 niveles · preorden 27 10 5 40 28 30 50</p>"
   },
   {
    "n": "1b",
    "q": "Secuencia 2: insertar 10, 20, 30, 25, 27, 26, 5, 3, 4, 50; eliminar 27, 20, 10.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 10 → <code>10</code></li><li>Insertar 20 → <code>10(-,20)</code></li><li>Insertar 30 → <code>20(10,30)</code> · <b>Simple a izquierda en 10 (FE 2)</b></li><li>Insertar 25 → <code>20(10,30(25,-))</code></li><li>Insertar 27 → <code>20(10,27(25,30))</code> · <b>Doble a derecha en 30 (FE -2)</b></li><li>Insertar 26 → <code>25(20(10,-),27(26,30))</code> · <b>Doble a izquierda en 20 (FE 2)</b></li><li>Insertar 5 → <code>25(10(5,20),27(26,30))</code> · <b>Simple a derecha en 20 (FE -2)</b></li><li>Insertar 3 → <code>25(10(5(3,-),20),27(26,30))</code></li><li>Insertar 4 → <code>25(10(4(3,5),20),27(26,30))</code> · <b>Doble a derecha en 5 (FE -2)</b></li><li>Insertar 50 → <code>25(10(4(3,5),20),27(26,30(-,50)))</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 27 → <code>25(10(4(3,5),20),30(26,50))</code></li><li>Eliminar 20 → <code>25(4(3,10(5,-)),30(26,50))</code> · <b>Simple a derecha en 10 (FE -2)</b></li><li>Eliminar 10 → <code>25(4(3,5),30(26,50))</code></li></ol><p><b>Árbol final:</b> <code>25(4(3,5),30(26,50))</code> · altura 3 niveles · preorden 25 4 3 5 30 26 50</p>"
   },
   {
    "n": "1c",
    "q": "Secuencia 3: insertar 50, 30, 70, 20, 40, 10, 25, 5, 65, 80; eliminar 20, 30, 70.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 50 → <code>50</code></li><li>Insertar 30 → <code>50(30,-)</code></li><li>Insertar 70 → <code>50(30,70)</code></li><li>Insertar 20 → <code>50(30(20,-),70)</code></li><li>Insertar 40 → <code>50(30(20,40),70)</code></li><li>Insertar 10 → <code>30(20(10,-),50(40,70))</code> · <b>Simple a derecha en 50 (FE -2)</b></li><li>Insertar 25 → <code>30(20(10,25),50(40,70))</code></li><li>Insertar 5 → <code>30(20(10(5,-),25),50(40,70))</code></li><li>Insertar 65 → <code>30(20(10(5,-),25),50(40,70(65,-)))</code></li><li>Insertar 80 → <code>30(20(10(5,-),25),50(40,70(65,80)))</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 20 → <code>30(10(5,25),50(40,70(65,80)))</code> · <b>Simple a derecha en 25 (FE -2)</b></li><li>Eliminar 30 → <code>40(10(5,25),70(50(-,65),80))</code> · <b>Simple a izquierda en 50 (FE 2)</b></li><li>Eliminar 70 → <code>40(10(5,25),65(50,80))</code> · <b>Doble a derecha en 80 (FE -2)</b></li></ol><p><b>Árbol final:</b> <code>40(10(5,25),65(50,80))</code> · altura 3 niveles · preorden 40 10 5 25 65 50 80</p>"
   },
   {
    "n": "1d",
    "q": "Secuencia 4: insertar 60, 55, 50, 52, 51, 53, 40, 30, 20, 10; eliminar 52, 55, 40.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 60 → <code>60</code></li><li>Insertar 55 → <code>60(55,-)</code></li><li>Insertar 50 → <code>55(50,60)</code> · <b>Simple a derecha en 60 (FE -2)</b></li><li>Insertar 52 → <code>55(50(-,52),60)</code></li><li>Insertar 51 → <code>55(51(50,52),60)</code> · <b>Doble a izquierda en 50 (FE 2)</b></li><li>Insertar 53 → <code>52(51(50,-),55(53,60))</code> · <b>Doble a derecha en 55 (FE -2)</b></li><li>Insertar 40 → <code>52(50(40,51),55(53,60))</code> · <b>Simple a derecha en 51 (FE -2)</b></li><li>Insertar 30 → <code>52(50(40(30,-),51),55(53,60))</code></li><li>Insertar 20 → <code>52(50(30(20,40),51),55(53,60))</code> · <b>Simple a derecha en 40 (FE -2)</b></li><li>Insertar 10 → <code>52(30(20(10,-),50(40,51)),55(53,60))</code> · <b>Simple a derecha en 50 (FE -2)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 52 → <code>53(30(20(10,-),50(40,51)),55(-,60))</code></li><li>Eliminar 55 → <code>30(20(10,-),53(50(40,51),60))</code> · <b>Simple a derecha en 53 (FE -2)</b></li><li>Eliminar 40 → <code>30(20(10,-),53(50(-,51),60))</code></li></ol><p><b>Árbol final:</b> <code>30(20(10,-),53(50(-,51),60))</code> · altura 4 niveles · preorden 30 20 10 53 50 51 60</p>"
   },
   {
    "n": "1e",
    "q": "Secuencia 5: insertar 15, 10, 20, 18, 25, 30, 28, 27, 26, 5; eliminar 28, 20, 15.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 15 → <code>15</code></li><li>Insertar 10 → <code>15(10,-)</code></li><li>Insertar 20 → <code>15(10,20)</code></li><li>Insertar 18 → <code>15(10,20(18,-))</code></li><li>Insertar 25 → <code>15(10,20(18,25))</code></li><li>Insertar 30 → <code>20(15(10,18),25(-,30))</code> · <b>Simple a izquierda en 15 (FE 2)</b></li><li>Insertar 28 → <code>20(15(10,18),28(25,30))</code> · <b>Doble a izquierda en 25 (FE 2)</b></li><li>Insertar 27 → <code>20(15(10,18),28(25(-,27),30))</code></li><li>Insertar 26 → <code>20(15(10,18),28(26(25,27),30))</code> · <b>Doble a izquierda en 25 (FE 2)</b></li><li>Insertar 5 → <code>20(15(10(5,-),18),28(26(25,27),30))</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 28 → <code>20(15(10(5,-),18),26(25,30(27,-)))</code> · <b>Simple a derecha en 30 (FE -2)</b></li><li>Eliminar 20 → <code>25(15(10(5,-),18),27(26,30))</code> · <b>Doble a izquierda en 26 (FE 2)</b></li><li>Eliminar 15 → <code>25(10(5,18),27(26,30))</code> · <b>Simple a derecha en 18 (FE -2)</b></li></ol><p><b>Árbol final:</b> <code>25(10(5,18),27(26,30))</code> · altura 3 niveles · preorden 25 10 5 18 27 26 30</p>"
   },
   {
    "n": "1f",
    "q": "Secuencia 6: insertar 100, 80, 120, 70, 90, 85, 95, 60, 50, 55; eliminar 90, 80, 100.",
    "a": "<p><b>Inserciones</b> (rotaciones en negrita):</p><ol><li>Insertar 100 → <code>100</code></li><li>Insertar 80 → <code>100(80,-)</code></li><li>Insertar 120 → <code>100(80,120)</code></li><li>Insertar 70 → <code>100(80(70,-),120)</code></li><li>Insertar 90 → <code>100(80(70,90),120)</code></li><li>Insertar 85 → <code>90(80(70,85),100(-,120))</code> · <b>Doble a derecha en 100 (FE -2)</b></li><li>Insertar 95 → <code>90(80(70,85),100(95,120))</code></li><li>Insertar 60 → <code>90(80(70(60,-),85),100(95,120))</code></li><li>Insertar 50 → <code>90(80(60(50,70),85),100(95,120))</code> · <b>Simple a derecha en 70 (FE -2)</b></li><li>Insertar 55 → <code>90(60(50(-,55),80(70,85)),100(95,120))</code> · <b>Simple a derecha en 80 (FE -2)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 90 → <code>95(60(50(-,55),80(70,85)),100(-,120))</code></li><li>Eliminar 80 → <code>95(60(50(-,55),85(70,-)),100(-,120))</code></li><li>Eliminar 100 → <code>60(50(-,55),95(85(70,-),120))</code> · <b>Simple a derecha en 95 (FE -2)</b></li></ol><p><b>Árbol final:</b> <code>60(50(-,55),95(85(70,-),120))</code> · altura 4 niveles · preorden 60 50 55 95 85 70 120</p>"
   }
  ]
 },
 {
  "id": "tp6",
  "nombre": "TP6 · Árboles B",
  "intro": "Convenciones usadas (el enunciado no las fija; si tu cátedra usa otras, el resultado puede variar): al dividir un nodo que excede, sube la <b>mediana</b> (si hay dos del medio, la de la izquierda); al eliminar una clave de un nodo interno se la reemplaza por el <b>sucesor</b>; ante un nodo por debajo del mínimo, primero se intenta pedir prestada una clave al hermano <b>izquierdo</b> y luego al derecho (rotación por el padre) y, si ninguno tiene de sobra, se <b>fusiona</b> con un hermano.",
  "items": [
   {
    "n": "1a",
    "q": "¿Qué determina el orden (m) de un árbol B?",
    "a": "<p>La <b>cantidad máxima de hijos</b> que puede tener un nodo. De ahí salen: máximo m − 1 claves por nodo y, en nodos no raíz, mínimo ⌈m/2⌉ hijos.</p>"
   },
   {
    "n": "1b",
    "q": "¿Mínimo de claves de un nodo que no es la raíz?",
    "a": "<p><b>⌈m/2⌉ − 1</b>. Con m = 3: 1 · m = 4: 1 · m = 5: 2. (La raíz puede tener solo 1 clave.)</p>"
   },
   {
    "n": "2a",
    "q": "Secuencia 1 (m = 3): insertar 10, 20, 30, 40, 50; eliminar 20 y 40.",
    "a": "<p><b>m = 3</b> (máximo 2 claves por nodo, mínimo 1). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 10 → <code>[10]</code></li><li>Insertar 20 → <code>[10 20]</code></li><li>Insertar 30 → <code>[20]([10] [30])</code> · <b>split: sube 20 (10 | 30)</b></li><li>Insertar 40 → <code>[20]([10] [30 40])</code></li><li>Insertar 50 → <code>[20 40]([10] [30] [50])</code> · <b>split: sube 40 (30 | 50)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 20 → <code>[40]([10 30] [50])</code> · clave interna: se reemplaza por el sucesor 30; se quita 30 de la hoja; fusión con el hermano izquierdo: baja la clave del padre</li><li>Eliminar 40 → <code>[30]([10] [50])</code> · clave interna: se reemplaza por el sucesor 50; se quita 50 de la hoja; presta el hermano izquierdo (rotación por el padre)</li></ol>"
   },
   {
    "n": "2b",
    "q": "Secuencia 2 (m = 3): insertar 5, 1, 8, 3, 2, 4, 7; eliminar 8 y 3.",
    "a": "<p><b>m = 3</b> (máximo 2 claves por nodo, mínimo 1). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 5 → <code>[5]</code></li><li>Insertar 1 → <code>[1 5]</code></li><li>Insertar 8 → <code>[5]([1] [8])</code> · <b>split: sube 5 (1 | 8)</b></li><li>Insertar 3 → <code>[5]([1 3] [8])</code></li><li>Insertar 2 → <code>[2 5]([1] [3] [8])</code> · <b>split: sube 2 (1 | 3)</b></li><li>Insertar 4 → <code>[2 5]([1] [3 4] [8])</code></li><li>Insertar 7 → <code>[2 5]([1] [3 4] [7 8])</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 8 → <code>[2 5]([1] [3 4] [7])</code> · se quita 8 de la hoja</li><li>Eliminar 3 → <code>[2 5]([1] [4] [7])</code> · se quita 3 de la hoja</li></ol>"
   },
   {
    "n": "2c",
    "q": "Secuencia 3 (m = 4): insertar 10, 20, 30, 40, 50, 60, 70; eliminar 10 y 40.",
    "a": "<p><b>m = 4</b> (máximo 3 claves por nodo, mínimo 1). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 10 → <code>[10]</code></li><li>Insertar 20 → <code>[10 20]</code></li><li>Insertar 30 → <code>[10 20 30]</code></li><li>Insertar 40 → <code>[20]([10] [30 40])</code> · <b>split: sube 20 (10 | 30,40)</b></li><li>Insertar 50 → <code>[20]([10] [30 40 50])</code></li><li>Insertar 60 → <code>[20 40]([10] [30] [50 60])</code> · <b>split: sube 40 (30 | 50,60)</b></li><li>Insertar 70 → <code>[20 40]([10] [30] [50 60 70])</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 10 → <code>[40]([20 30] [50 60 70])</code> · se quita 10 de la hoja; fusión con el hermano derecho: baja la clave del padre</li><li>Eliminar 40 → <code>[50]([20 30] [60 70])</code> · clave interna: se reemplaza por el sucesor 50; se quita 50 de la hoja</li></ol>"
   },
   {
    "n": "2d",
    "q": "Secuencia 4 (m = 4): insertar 50, 100, 150, 200, 250, 300; eliminar 250 y 100.",
    "a": "<p><b>m = 4</b> (máximo 3 claves por nodo, mínimo 1). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 50 → <code>[50]</code></li><li>Insertar 100 → <code>[50 100]</code></li><li>Insertar 150 → <code>[50 100 150]</code></li><li>Insertar 200 → <code>[100]([50] [150 200])</code> · <b>split: sube 100 (50 | 150,200)</b></li><li>Insertar 250 → <code>[100]([50] [150 200 250])</code></li><li>Insertar 300 → <code>[100 200]([50] [150] [250 300])</code> · <b>split: sube 200 (150 | 250,300)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 250 → <code>[100 200]([50] [150] [300])</code> · se quita 250 de la hoja</li><li>Eliminar 100 → <code>[200]([50 150] [300])</code> · clave interna: se reemplaza por el sucesor 150; se quita 150 de la hoja; fusión con el hermano izquierdo: baja la clave del padre</li></ol>"
   },
   {
    "n": "2e",
    "q": "Secuencia 5 (m = 5): insertar 1, 2, 3, 4, 5, 6, 7, 8, 9, 10; eliminar 5 y 1.",
    "a": "<p><b>m = 5</b> (máximo 4 claves por nodo, mínimo 2). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 1 → <code>[1]</code></li><li>Insertar 2 → <code>[1 2]</code></li><li>Insertar 3 → <code>[1 2 3]</code></li><li>Insertar 4 → <code>[1 2 3 4]</code></li><li>Insertar 5 → <code>[3]([1 2] [4 5])</code> · <b>split: sube 3 (1,2 | 4,5)</b></li><li>Insertar 6 → <code>[3]([1 2] [4 5 6])</code></li><li>Insertar 7 → <code>[3]([1 2] [4 5 6 7])</code></li><li>Insertar 8 → <code>[3 6]([1 2] [4 5] [7 8])</code> · <b>split: sube 6 (4,5 | 7,8)</b></li><li>Insertar 9 → <code>[3 6]([1 2] [4 5] [7 8 9])</code></li><li>Insertar 10 → <code>[3 6]([1 2] [4 5] [7 8 9 10])</code></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 5 → <code>[3 7]([1 2] [4 6] [8 9 10])</code> · se quita 5 de la hoja; presta el hermano derecho (rotación por el padre)</li><li>Eliminar 1 → <code>[7]([2 3 4 6] [8 9 10])</code> · se quita 1 de la hoja; fusión con el hermano derecho: baja la clave del padre</li></ol>"
   },
   {
    "n": "2f",
    "q": "Secuencia 6 (m = 3): insertar 15, 7, 22, 5, 10; eliminar 22 y 15.",
    "a": "<p><b>m = 3</b> (máximo 2 claves por nodo, mínimo 1). Notación <code>[claves](hijos)</code>.</p><p><b>Inserciones:</b></p><ol><li>Insertar 15 → <code>[15]</code></li><li>Insertar 7 → <code>[7 15]</code></li><li>Insertar 22 → <code>[15]([7] [22])</code> · <b>split: sube 15 (7 | 22)</b></li><li>Insertar 5 → <code>[15]([5 7] [22])</code></li><li>Insertar 10 → <code>[7 15]([5] [10] [22])</code> · <b>split: sube 7 (5 | 10)</b></li></ol><p><b>Eliminaciones:</b></p><ol><li>Eliminar 22 → <code>[7]([5] [10 15])</code> · se quita 22 de la hoja; fusión con el hermano izquierdo: baja la clave del padre</li><li>Eliminar 15 → <code>[7]([5] [10])</code> · se quita 15 de la hoja</li></ol>"
   }
  ]
 },
 {
  "id": "tp7",
  "nombre": "TP7 · Grafos",
  "intro": "",
  "items": [
   {
    "n": "1a",
    "q": "¿Qué representan las filas y las columnas de una matriz de adyacencia? ¿Cómo se indica que existe o no una relación?",
    "a": "<p>Las filas y las columnas representan los <b>vértices</b>. La celda A[i][j] vale <b>1</b> (o el peso, si es ponderado) si existe una arista o arco del vértice i al j, y <b>0</b> (o ∞) si no existe. En un grafo no dirigido la matriz es <b>simétrica</b> (A[i][j] = A[j][i]); en un dirigido no necesariamente.</p>"
   },
   {
    "n": "1b",
    "q": "En una lista de adyacencia, ¿qué representa el vector principal y qué los elementos de las listas?",
    "a": "<p>El <b>vector principal</b> tiene una posición por <b>vértice</b>. La lista enlazada de la posición i contiene los vértices <b>adyacentes</b> a i (con el peso de la arista, si corresponde): sus vecinos, o los vértices a los que sale un arco desde i.</p>"
   },
   {
    "n": "1c",
    "q": "Diferencia de estrategia entre BFS y DFS. ¿Qué estructura auxiliar usa cada uno?",
    "a": "<p><b>BFS (anchura):</b> visita todos los vecinos del vértice actual antes de pasar al siguiente nivel; usa una <b>cola</b> (FIFO) para atender los vértices en el orden en que se descubrieron. <b>DFS (profundidad):</b> avanza por un camino hasta no poder más y retrocede (backtracking); usa una <b>pila</b> (LIFO), explícita o la de la recursión, para volver al último vértice con vecinos sin visitar.</p>"
   },
   {
    "n": "2a–d",
    "q": "Dibujar un grafo no dirigido desde su matriz (V = {A, B, C, D, E}) y un dígrafo desde su lista (V = {1, 2, 3, 4, 5}); secuencia de visitados de BFS y DFS hasta encontrar E y 5.",
    "a": "<div class=\"todo\">Las matrices y las listas de estos ejercicios están en imágenes del enunciado que no pude leer del PDF, así que no resolví los dibujos ni las secuencias exactas. <b>Cómo hacerlo:</b> escribí cada arista en la pestaña <b>Grafos</b> (una por línea: <code>A B</code>) y el simulador te da el BFS y el DFS paso a paso, con los vecinos en orden alfabético o numérico; es el mismo criterio que usan los finales (Julio 2025: BFS = A B C D E, DFS = A B D E C). Si me pasás las imágenes, completo este apartado.</div><p><b>Método a mano:</b> BFS → se encola el origen; mientras la cola no esté vacía, se saca un vértice, se lo marca visitado y se encolan sus vecinos no visitados (en orden). DFS → se apila el origen; se saca un vértice, si no está visitado se lo marca y se apilan sus vecinos (si se apila al revés, se recorre en orden alfabético).</p>"
   }
  ]
 }
];
