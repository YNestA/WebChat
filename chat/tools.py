# -*- coding:utf-8 -*-
import re
from django.contrib.auth.models import User

def check_register(username,password,passwordR,email):
    if len(username)>30:
        return ('username','用户名长度超过30')
    elif len(password)<6 or len(password)>30:
        return ('password','密码长度应在6到30之间')
    elif password!=passwordR:
        return ('passwordR','两次密码不一致')
    elif re.match(r'^[0-9a-zA-Z\-\_\+]+$',username) is None:
        return ('username','用户名包含非法字符')
    elif re.match(r'^([0-9a-zA-Z\_\-])+@([0-9a-zA-Z\_\-])+(\.[0-9a-zA-Z\_\-])+',email) is None:
        return ('email','邮箱格式有误')
    elif User.objects.filter(username=username):
        return ('username','用户名已存在')
    else:
        return 'True'

