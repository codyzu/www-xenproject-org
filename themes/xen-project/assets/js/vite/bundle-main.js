import './components/IconButton.js'
import 'uno.css'

// Eagerly import the markdown content files so that they are processed by UnoCSS
const markdownFiles = import.meta.glob('../../../../../content/**/*.md', {eager: true})
// const htmlFiles = import.meta.glob('../../layouts/**/*.html', {eager: true})
const htmlFiles = import.meta.glob('../../../layouts/**/*.html', {query: '?raw', eager: true})
