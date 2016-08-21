# -*- coding:utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.db.models.signals import post_save


class UserProfile(models.Model):
    user=models.OneToOneField(User,related_name="user_profile")
    TEL=models.CharField(max_length=15)
    created_time=models.DateTimeField(default=datetime.now)
    head_img=models.CharField(max_length=200,default="/static/image/common/user.jpg")
    def __unicode__(self):
        return self.user.username


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

    def __unicode__(self):
        return ' | '.join([self.from_user.username,self.to_user.username,self.content[:20]])