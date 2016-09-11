# -*- coding:utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
import time as my_time
from django.db.models.signals import post_save
from tools import *


class UserProfile(models.Model):
    user=models.OneToOneField(User,related_name="user_profile")
    TEL=models.CharField(max_length=15)
    created_time=models.DateTimeField(default=datetime.now)
    head_img=models.CharField(max_length=200,default="/static/image/common/user.jpg")
    friends=models.ManyToManyField(User,related_name="friends")

    def __unicode__(self):
        return self.user.username

    def __compare(self,x,y):
        if x.time>y.time: return -1
        if x.time<y.time: return 1
        if x.time==y.time: return 0


    def get_chat_user(self,from_user,before_time=None,count=15):
        if before_time is None:
            res,records=[],list(self.user.as_to_user.filter(from_user=from_user).order_by('-time'))
            #for record in records:
            #    record.checked=True
            #    record.save()
            records.extend(list(from_user.as_to_user.filter(from_user=self.user).order_by('-time')))
            records.sort(self.__compare)
            for x in records:
                if not res or datetime_to_timestamp(x.time)-datetime_to_timestamp(res[-1][-1].time)<-120:
                    res.append([x])
                else:
                    res[-1].append(x)
        return res

    def get_not_read(self):
        return self.user.as_to_user.filter(checked=False).order_by('-time')

def create_user_profile(sender,instance,created,**kw):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile,sender=User)

class ChatGroup(models.Model):
    name=models.CharField(max_length=30)
    group_id=models.CharField(max_length=15)
    members=models.ManyToManyField(User,related_name="as_group_member")
    leader=models.ForeignKey(User,related_name="as_group_leader",blank=True)
    admins=models.ManyToManyField(User,related_name="as_group_admin",blank=True)
    created_time=models.DateTimeField(default=datetime.now)
    enable=models.BooleanField(default=True)

    def __unicode__(self):
        return self.name

class UTGMessage(models.Model):
    from_user=models.ForeignKey(User,related_name="as_from_user_utg")
    to_group=models.ForeignKey(ChatGroup,related_name="as_to_group")
    time=models.DateTimeField(default=datetime.now)
    content=models.TextField(max_length=800)
    enable=models.BooleanField(default=True)

    def __unicode__(self):
        return ' | '.join([self.from_user.username,self.to_group.name,self.content[:20]])

class UTUMessage(models.Model):
    from_user=models.ForeignKey(User,related_name="as_from_user_utu")
    to_user=models.ForeignKey(User,related_name="as_to_user")
    time=models.DateTimeField(default=datetime.now)
    content=models.TextField(max_length=800)
    enable=models.BooleanField(default=True)
    checked=models.BooleanField(default=False)

    def __unicode__(self):
        return ' | '.join([self.from_user.username,self.to_user.username,self.content[:20]])