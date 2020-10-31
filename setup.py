# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 8/14/20 23:05

import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="frida-dexdump",
    version="1.0.2",
    description="Fast dex dump in memory based on frida.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="hluwa",
    author_email="hluwa888@gmail.com",
    url="https://github.com/hluwa/FRIDA-DEXDump",
    install_requires=[
        "frida",
        "click"
    ],
    keywords="frida android unpack dex dynamic",
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
        "Programming Language :: JavaScript",
    ],
    packages=["frida_dexdump"],
    package_data={
        "frida_dexdump": ["agent.js"],
    },
    entry_points={
        'console_scripts': [
            "frida-dexdump = frida_dexdump.main:entry"
        ]
    }
)