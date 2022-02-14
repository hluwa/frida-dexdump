all: package

frida_dexdump/agent/agent.js: agent/src/index.ts agent/src/search.ts

	cd agent; npm install; npm run build

package: frida_dexdump/agent/agent.js
	python3 setup.py sdist bdist_wheel