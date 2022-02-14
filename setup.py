# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreateTime: 2021/6/3

import setuptools

setuptools.setup(
    name="frida-dexdump",
    version="2.0.1",
    description="Useful and fast android unpacker",
    author="hluwa",
    author_email="hluwa888@gmail.com",
    url="https://github.com/hluwa/frida-dexdump",
    install_requires=[
        "click",
        "frida-tools",
        "wallbreaker"
    ],
    keywords="frida android dexdump unpacker wallbreaker",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: Microsoft :: Windows",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
    packages=setuptools.find_packages(where='.', exclude=(), include=('*',)),
    package_data={
        "frida_dexdump.agent": ["agent.js"]
    },
    entry_points={
        'console_scripts': [
            "frida-dexdump = frida_dexdump.__main__:main",
        ]
    }
)
