export type DisplayLanguage = 'zh' | 'en'
export type SpeechRate = 0.55 | 0.8 | 1

const meanings: Record<string, string> = {
  'hola': 'hello', 'gracias': 'thank you', 'por favor': 'please', 'perdón': 'sorry / excuse me',
  'encantado': 'nice to meet you (said by a man)', 'adiós': 'goodbye', 'bienvenido': 'welcome (masculine)', 'hasta luego': 'see you later',
  'casa': 'home / house', 'trabajo': 'work', 'comer': 'to eat', 'beber': 'to drink', 'mañana': 'tomorrow / morning',
  'también': 'also', 'dormir': 'to sleep', 'familia': 'family', 'menú': 'menu', 'mesa': 'table', 'agua': 'water',
  'café': 'coffee', 'cuenta': 'bill / check', 'delicioso': 'delicious', 'sin azúcar': 'without sugar', 'tengo hambre': 'I am hungry',
  'dónde': 'where', 'derecha': 'right', 'izquierda': 'left', 'estación': 'station', 'billete': 'ticket', 'andén': 'platform',
  'equipaje': 'luggage', 'ida y vuelta': 'round trip', 'cuánto cuesta': 'how much is it', 'barato': 'cheap', 'caro': 'expensive',
  'talla': 'size', 'probarse': 'to try on', 'tarjeta': 'card', 'efectivo': 'cash', 'recibo': 'receipt', 'reserva': 'reservation',
  'habitación': 'room', 'llave': 'key', 'desayuno': 'breakfast', 'una noche': 'one night', 'disponible': 'available',
  'ascensor': 'lift / elevator', 'salida tardía': 'late checkout',

  'me llamo ana.': 'My name is Ana.', 'mi apellido es li.': 'My surname is Li.', 'soy de china.': 'I am from China.',
  'vivo en madrid.': 'I live in Madrid.', 'tengo treinta años.': 'I am thirty years old.', '¿cómo te llamas?': 'What is your name?',
  '¿cuál es tu apellido?': 'What is your surname?', '¿de dónde eres?': 'Where are you from?', '¿dónde vives?': 'Where do you live?',
  '¿cómo se escribe?': 'How do you spell it?', '¿puedes repetirlo?': 'Can you repeat that?', 'estoy aprendiendo español.': 'I am learning Spanish.',
  '¿cuál es tu número de teléfono?': 'What is your phone number?', 'mi número de teléfono es...': 'My phone number is…',
  '¿me das tu número?': 'Can you give me your number?', 'te mando un mensaje.': 'I will send you a message.',
  '¿cuál es tu correo electrónico?': 'What is your email address?', 'mi correo es...': 'My email is…',
  '¿cuándo es tu cumpleaños?': 'When is your birthday?', 'mi cumpleaños es el cinco de mayo.': 'My birthday is on the fifth of May.',
  'nací el cinco de mayo.': 'I was born on the fifth of May.', 'hoy es catorce de agosto.': 'Today is the fourteenth of August.',
  'son las tres y media.': 'It is half past three.', 'quedamos a las seis.': 'Let us meet at six.',
  '¿cuál es la dirección?': 'What is the address?', 'la dirección es correcta.': 'The address is correct.',
  'vivo en el quinto piso.': 'I live on the fifth floor.', 'es el portal cinco.': 'It is entrance number five.',
  'es el quinto c.': 'It is flat C on the fifth floor.', 'toca el timbre del quinto c.': 'Ring the bell for flat C on the fifth floor.',
  'estoy en casa.': 'I am at home.', 'ahora bajo.': 'I am coming downstairs now.', '¿puedes subir?': 'Can you come upstairs?',
  'déjalo en la puerta.': 'Leave it at the door.', 'llama cuando llegues.': 'Call me when you arrive.',
  'no encuentro la entrada.': 'I cannot find the entrance.', 'no entiendo.': 'I do not understand.',
  'más despacio, por favor.': 'More slowly, please.', '¿puede repetirlo?': 'Could you repeat that?',
  '¿cómo se dice esto?': 'How do you say this?', '¿qué significa?': 'What does it mean?', 'necesito ayuda.': 'I need help.',
  'busco esta dirección.': 'I am looking for this address.', 'quiero pedir una cita.': 'I would like to make an appointment.',
  'tengo una reserva.': 'I have a reservation.', 'pago con tarjeta.': 'I am paying by card.', '¿dónde está el baño?': 'Where is the bathroom?',
  'un momento, por favor.': 'One moment, please.',
  'cuando pueda, inicie la marcha.': 'When it is safe, start driving.', 'siga de frente.': 'Continue straight ahead.',
  'gire a la derecha.': 'Turn right.', 'gire a la izquierda.': 'Turn left.',
  'tome la primera calle a la derecha.': 'Take the first street on the right.',
  'tome la segunda calle a la izquierda.': 'Take the second street on the left.',
  'en la rotonda, tome la primera salida.': 'At the roundabout, take the first exit.',
  'en la rotonda, tome la tercera salida.': 'At the roundabout, take the third exit.',
  'cambie al carril de la izquierda.': 'Move into the left lane.', 'cambie al carril de la derecha.': 'Move into the right lane.',
  'incorpórese a la autovía.': 'Join the motorway.', 'tome la próxima salida.': 'Take the next exit.',
  'cuando pueda, estacione.': 'When it is safe, park.', 'estacione detrás de ese vehículo.': 'Park behind that vehicle.',
  'pare junto al bordillo.': 'Stop next to the kerb.', 'realice un cambio de sentido cuando pueda.': 'Make a U-turn when it is safe.',
  'reanude la marcha.': 'Resume driving.', 'siga las indicaciones de las señales.': 'Follow the road signs.',
  'encienda las luces de cruce.': 'Turn on the dipped headlights.', 'active el limpiaparabrisas.': 'Turn on the windscreen wipers.',
  '¿ha dicho la primera salida?': 'Did you say the first exit?', '¿puede repetir la indicación?': 'Could you repeat the instruction?',
  '¿giro en esta calle?': 'Do I turn on this street?', '¿sigo de frente?': 'Should I continue straight ahead?',

  'y': 'and', 'o': 'or', 'pero': 'but', 'porque': 'because', 'si': 'if', 'no': 'no / not', 'sí': 'yes', 'tampoco': 'neither / not either',
  'muy': 'very', 'más': 'more', 'menos': 'less', 'aquí': 'here', 'allí': 'there', 'ahora': 'now', 'qué': 'what', 'quién': 'who',
  'cómo': 'how', 'cuándo': 'when', 'hoy': 'today', 'ayer': 'yesterday', 'día': 'day', 'semana': 'week', 'mes': 'month',
  'año': 'year', 'hora': 'hour / time', 'minuto': 'minute', 'lunes': 'Monday', 'martes': 'Tuesday', 'miércoles': 'Wednesday',
  'jueves': 'Thursday', 'viernes': 'Friday', 'sábado': 'Saturday', 'domingo': 'Sunday', 'temprano': 'early', 'tarde': 'afternoon / late',
  'noche': 'night', 'siempre': 'always', 'cero': 'zero', 'uno': 'one', 'dos': 'two', 'tres': 'three', 'cuatro': 'four',
  'cinco': 'five', 'seis': 'six', 'siete': 'seven', 'ocho': 'eight', 'nueve': 'nine', 'diez': 'ten', 'once': 'eleven',
  'doce': 'twelve', 'veinte': 'twenty', 'cien': 'one hundred', 'primero': 'first', 'último': 'last', 'mucho': 'a lot / much',
  'poco': 'a little / few', 'bastante': 'enough / quite', 'persona': 'person', 'hombre': 'man', 'mujer': 'woman', 'niño': 'boy / child',
  'niña': 'girl / child', 'amigo': 'male friend', 'amiga': 'female friend', 'padre': 'father', 'madre': 'mother', 'hijo': 'son',
  'hija': 'daughter', 'hermano': 'brother', 'hermana': 'sister', 'marido': 'husband', 'esposa': 'wife', 'nombre': 'name',
  'edad': 'age', 'señor': 'Mr / gentleman', 'señora': 'Mrs / lady', 'cocina': 'kitchen', 'baño': 'bathroom', 'puerta': 'door',
  'ventana': 'window', 'silla': 'chair', 'cama': 'bed', 'teléfono': 'phone', 'ropa': 'clothes', 'zapato': 'shoe', 'bolsa': 'bag',
  'cosa': 'thing', 'limpio': 'clean', 'sucio': 'dirty', 'abierto': 'open', 'cerrado': 'closed', 'cerca': 'near',
  'té': 'tea', 'leche': 'milk', 'pan': 'bread', 'arroz': 'rice', 'carne': 'meat', 'pescado': 'fish', 'pollo': 'chicken',
  'huevo': 'egg', 'fruta': 'fruit', 'verdura': 'vegetable', 'comida': 'food / lunch', 'cena': 'dinner', 'hambre': 'hunger',
  'sed': 'thirst', 'calle': 'street', 'plaza': 'square', 'ciudad': 'city', 'centro': 'centre / downtown', 'tienda': 'shop',
  'mercado': 'market', 'banco': 'bank', 'hospital': 'hospital', 'farmacia': 'pharmacy', 'escuela': 'school', 'delante': 'in front',
  'detrás': 'behind', 'dentro': 'inside', 'fuera': 'outside', 'lejos': 'far', 'camino': 'road / way', 'entrada': 'entrance',
  'salida': 'exit', 'viaje': 'trip / travel', 'aeropuerto': 'airport', 'tren': 'train', 'autobús': 'bus', 'metro': 'metro / subway',
  'taxi': 'taxi', 'coche': 'car', 'avión': 'plane', 'maleta': 'suitcase', 'mapa': 'map', 'hotel': 'hotel', 'pasaporte': 'passport',
  'asiento': 'seat', 'ida': 'outward journey', 'vuelta': 'return journey', 'precio': 'price', 'dinero': 'money', 'grande': 'large',
  'pequeño': 'small', 'color': 'colour', 'rojo': 'red', 'azul': 'blue', 'blanco': 'white', 'negro': 'black', 'nuevo': 'new',
  'cambio': 'change / exchange', 'regalo': 'gift', 'cliente': 'customer', 'cabeza': 'head', 'cara': 'face', 'ojo': 'eye',
  'boca': 'mouth', 'mano': 'hand', 'brazo': 'arm', 'pierna': 'leg', 'pie': 'foot', 'cuerpo': 'body', 'salud': 'health',
  'dolor': 'pain', 'fiebre': 'fever', 'médico': 'doctor', 'medicina': 'medicine', 'cansado': 'tired', 'enfermo': 'ill / sick',
  'mejor': 'better', 'mal': 'badly / unwell', 'ayuda': 'help', 'urgente': 'urgent', 'libro': 'book', 'página': 'page',
  'palabra': 'word', 'pregunta': 'question', 'respuesta': 'answer', 'idioma': 'language', 'español': 'Spanish', 'chino': 'Chinese',
  'inglés': 'English', 'clase': 'class', 'profesor': 'male teacher', 'profesora': 'female teacher', 'estudiante': 'student',
  'ejemplo': 'example', 'idea': 'idea', 'fácil': 'easy', 'difícil': 'difficult', 'correcto': 'correct', 'error': 'mistake / error',
  'nivel': 'level', 'oficina': 'office', 'empresa': 'company', 'jefe': 'boss', 'compañero': 'colleague', 'reunión': 'meeting',
  'proyecto': 'project', 'problema': 'problem', 'solución': 'solution', 'correo': 'email / post', 'mensaje': 'message',
  'información': 'information', 'documento': 'document', 'fecha': 'date', 'equipo': 'team', 'importante': 'important',
  'posible': 'possible', 'listo': 'ready', 'ocupado': 'busy', 'libre': 'free / available',
  'ser': 'to be (identity)', 'estar': 'to be (state / location)', 'tener': 'to have', 'hacer': 'to do / make', 'ir': 'to go',
  'venir': 'to come', 'poder': 'to be able to', 'querer': 'to want / love', 'decir': 'to say / tell', 'hablar': 'to speak',
  'ver': 'to see', 'dar': 'to give', 'saber': 'to know a fact', 'conocer': 'to know / meet', 'vivir': 'to live',
  'salir': 'to go out / leave', 'llegar': 'to arrive', 'poner': 'to put', 'pasar': 'to pass / happen', 'deber': 'should / to owe',
  'tomar': 'to take / drink', 'llevar': 'to carry / wear', 'dejar': 'to leave / allow', 'encontrar': 'to find', 'buscar': 'to look for',
  'necesitar': 'to need', 'usar': 'to use', 'comprar': 'to buy', 'pagar': 'to pay', 'pedir': 'to ask for / order', 'abrir': 'to open',
  'cerrar': 'to close', 'leer': 'to read', 'escribir': 'to write', 'escuchar': 'to listen', 'entender': 'to understand', 'recordar': 'to remember',
  'buenos días': 'good morning', 'buenas tardes': 'good afternoon', 'buenas noches': 'good evening / good night',
  'hasta mañana': 'see you tomorrow', 'muchas gracias': 'thank you very much', 'de nada': 'you are welcome',
  'por supuesto': 'of course', 'no sé': 'I do not know', 'no entiendo': 'I do not understand', 'otra vez': 'again',
  'más despacio': 'more slowly', 'está bien': 'okay / that is fine', 'tengo sed': 'I am thirsty', 'me gusta': 'I like it',
  'no me gusta': 'I do not like it', 'dónde está': 'where is it', 'qué hora es': 'what time is it', 'necesito ayuda': 'I need help',
}

const lemmaMeanings: Record<string, string> = {
  ser: 'to be (identity)', estar: 'to be (state / location)', tener: 'to have', hacer: 'to do / make', ir: 'to go',
  poder: 'to be able to', querer: 'to want', decir: 'to say', hablar: 'to speak', comer: 'to eat', vivir: 'to live',
  venir: 'to come', poner: 'to put', saber: 'to know', ver: 'to see', dar: 'to give', salir: 'to leave',
  llegar: 'to arrive', pasar: 'to pass / happen', deber: 'should / to owe',
}

const tenseMeanings: Record<string, string> = { present: 'present', preterite: 'preterite', imperfect: 'imperfect' }

export function englishMeaning(spanish: string) {
  const key = spanish.trim().toLocaleLowerCase('es-ES')
  const withoutArticle = key.replace(/^(el|la|los|las|un|una)\s+/, '')
  return meanings[key] ?? meanings[withoutArticle] ?? ''
}

export function conjugationMeaning(lemma: string, tense: string, person: string) {
  return `${lemma} (${lemmaMeanings[lemma] ?? `to ${lemma}`}) · ${tenseMeanings[tense] ?? tense} · ${person}`
}

const lessonEnglish: Record<string, { title: string; description: string; scene: string; kind: string }> = {
  'frases-presentarse': { title: 'Introduce yourself', description: 'Name, nationality, home and languages', scene: 'Basics', kind: 'Phrases' },
  'frases-contacto-fechas': { title: 'Phone, birthdays and plans', description: 'Exchange details, give dates and arrange a meeting', scene: 'Time', kind: 'Phrases' },
  'frases-direccion-entrega': { title: 'Address and deliveries', description: 'Explain floors, entrances and speak to a courier', scene: 'Accommodation', kind: 'Phrases' },
  'frases-supervivencia': { title: 'When you do not understand', description: 'Ask people to repeat, slow down or help', scene: 'Daily life', kind: 'Phrases' },
  'frases-examen-conducir-ruta': { title: 'Driving test: directions', description: 'Understand instructions about turns, roundabouts and lanes', scene: 'Driving test', kind: 'Phrases' },
  'frases-examen-conducir-maniobras': { title: 'Driving test: manoeuvres', description: 'Parking, U-turns, restarting and checking instructions', scene: 'Driving test', kind: 'Phrases' },
  'primeros-pasos': { title: 'First conversations', description: 'Greetings, thanks and essential openings', scene: 'Basics', kind: 'Dialogue' },
  'cada-dia': { title: 'Everyday Spanish', description: 'High-frequency actions at home, work and daily life', scene: 'Daily life', kind: 'Dialogue' },
  'en-el-restaurante': { title: 'Eating out', description: 'Menus, drinks, ordering and paying', scene: 'Restaurant', kind: 'Dialogue' },
  'de-viaje': { title: 'Transport and directions', description: 'Stations, directions and travel needs', scene: 'Travel', kind: 'Dialogue' },
  'de-compras': { title: 'Shopping and paying', description: 'Prices, sizes, trying things on and payment', scene: 'Shopping', kind: 'Dialogue' },
  'en-el-hotel': { title: 'Checking into a hotel', description: 'Reservations, check-in and room requests', scene: 'Accommodation', kind: 'Dialogue' },
  'padel-vocabulario': { title: 'Padel essentials', description: 'Rackets, court, walls, scoring and common shots', scene: 'Ball sports', kind: 'High frequency' },
  'padel-frases': { title: 'Spanish on a padel court', description: 'Arrange a match, choose sides and communicate with your partner', scene: 'Ball sports', kind: 'Phrases' },
  'tenis-vocabulario': { title: 'Tennis essentials', description: 'Equipment, court areas, shots and scoring', scene: 'Ball sports', kind: 'High frequency' },
  'tenis-frases': { title: 'Spanish on a tennis court', description: 'Arrange a match, serve, choose singles or doubles and call the score', scene: 'Ball sports', kind: 'Phrases' },
  'common-connectors': { title: 'Connectors and questions', description: 'Small words that build basic sentences', scene: 'Basics', kind: 'High frequency' },
  'common-time': { title: 'Time and dates', description: 'Dates, meetings and the rhythm of a day', scene: 'Time', kind: 'High frequency' },
  'common-numbers': { title: 'Numbers and quantity', description: 'Essential for prices, time and people', scene: 'Basics', kind: 'High frequency' },
  'common-family': { title: 'People and family', description: 'Introduce yourself and the people around you', scene: 'Family', kind: 'High frequency' },
  'common-home': { title: 'Home and daily life', description: 'Your home, belongings and everyday actions', scene: 'Daily life', kind: 'High frequency' },
  'common-food': { title: 'Food and ordering', description: 'From breakfast to paying in a restaurant', scene: 'Restaurant', kind: 'High frequency' },
  'common-city': { title: 'The city and directions', description: 'Find places, ask the way and read signs', scene: 'City', kind: 'High frequency' },
  'common-travel': { title: 'Transport and travel', description: 'Tickets, journeys, accommodation and getting around', scene: 'Travel', kind: 'High frequency' },
  'common-shopping': { title: 'Shopping and services', description: 'Prices, choices, sizes and payments', scene: 'Shopping', kind: 'High frequency' },
  'common-health': { title: 'Body and health', description: 'Describe body parts and simple symptoms', scene: 'Health', kind: 'High frequency' },
  'common-study': { title: 'Study and language', description: 'Classes, reading and language communication', scene: 'Study', kind: 'High frequency' },
  'common-work': { title: 'Work and communication', description: 'The office, plans and basic teamwork', scene: 'Work', kind: 'High frequency' },
  'common-actions-one': { title: 'Core actions I', description: 'The first high-frequency infinitives to learn', scene: 'Daily life', kind: 'High frequency' },
  'common-actions-two': { title: 'Core actions II', description: 'Useful verbs that appear constantly in conversation', scene: 'Daily life', kind: 'High frequency' },
  'common-dialogue': { title: 'Essential expressions', description: 'Short expressions you can use immediately', scene: 'Basics', kind: 'High frequency' },
}

export function lessonEnglishCopy(id: string, fallback: { title: string; description: string; level: string }, tense?: string, group?: number) {
  const fixed = lessonEnglish[id]
  if (fixed) return { ...fixed, eyebrow: `${fallback.level} · ${fixed.kind} · ${fixed.scene}` }
  if (id.startsWith('conjugation-')) {
    const tenseName = tenseMeanings[tense ?? ''] ?? 'Conjugation'
    return {
      title: `${tenseName[0].toUpperCase()}${tenseName.slice(1)} ${group ?? 1}`,
      description: 'Six-person conjugation practice, typed letter by letter',
      scene: 'Grammar', kind: 'Conjugation', eyebrow: `${fallback.level} · Conjugation · ${tenseName}`,
    }
  }
  return { title: fallback.title, description: fallback.description, scene: '', kind: '', eyebrow: fallback.level }
}

export const filterEnglish = {
  kinds: { '全部': 'All', '短句': 'Phrases', '对话': 'Dialogue', '高频': 'High frequency', '变位': 'Conjugation' } as Record<string, string>,
  scenes: { '全部': 'All', '日常交流': 'Daily communication', '生活办事': 'Everyday errands', '出行旅游': 'Travel & transport', '学习工作': 'Study & work', '驾考': 'Driving test', '球类': 'Ball sports', '语法': 'Grammar' } as Record<string, string>,
}
