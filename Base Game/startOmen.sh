if (node -v)
then
    node ./bin/server.js
else
    declare -A osInfo;
    osInfo[/etc/redhat-release]=yum install -y gcc-c++ make; curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -&&\ ; sudo yum install nodejs
    osInfo[/etc/arch-release]=pacman -S nodejs npm
    osInfo[/etc/gentoo-release]=emerge nodejs
    osInfo[/etc/SuSE-release]=zypp install nodejs14
    osInfo[/etc/debian_version]=apt install curl; curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\ ; apt install nodejs
    osInfo[/etc/alpine-release]=apk add nodejs npm

    for f in ${!osInfo[@]}
    do
        if [[ -f $f ]];then
            echo Package manager: ${osInfo[$f]}
            # eval sudo ${osInfo[$f]} install node
        fi
    done
    node ./bin/server.js
fi
exit