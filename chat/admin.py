# -*- coding:utf-8 -*-
from django.contrib import admin
from chat.models import *

# Register your models here.

admin.site.register(ChatGroup)
admin.site.register(UTGMessage)
admin.site.register(UTUMessage)
admin.site.register(UserProfile)