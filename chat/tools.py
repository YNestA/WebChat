# -*- coding:utf-8 -*-
import re
from django.contrib.auth.models import User
import time as my_time
from datetime import datetime

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


def datetime_to_timestamp(time):
    return int(my_time.mktime(time.timetuple()))

def deal_md_zero(md):
    if md[0] == '0' and md[3] == '0':
        return md[1:3] + md[4:]
    elif md[0] == '0':
        return md[1:]
    elif md[3] == '0':
        return md[:3] + md[4:]
    return md

def deal_HM_zero(HM):
    if HM[0]=='0':
        return HM[1:]
    return HM

def trans_left_dialog_time(time):
    return deal_md_zero(time.strftime('%m-%d')) if time.strftime('%m-%d') != datetime.now().strftime('%m-%d') else deal_HM_zero(time.strftime('%H:%M'))

def trans_right_dialog_time(time):
    if time.strftime('%m-%d')!=datetime.now().strftime('%m-%d'):
        res=time.strftime('%m-%d %H:%M').split()
        return deal_md_zero(res[0])+' '+deal_HM_zero(res[1])
    else:
        return deal_HM_zero(time.strftime('%H:%M'))