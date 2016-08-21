# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('group_id', models.CharField(max_length=15)),
                ('created_time', models.DateTimeField(default=datetime.datetime.now)),
                ('admins', models.ManyToManyField(related_name='as_group_admin', to=settings.AUTH_USER_MODEL, blank=True)),
                ('leader', models.ForeignKey(related_name='as_group_leader', blank=True, to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(related_name='as_group_member', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sdad_id', models.CharField(max_length=15)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UTGMessage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('content', models.TextField(max_length=800)),
                ('from_user', models.ForeignKey(related_name='as_from_user_utg', to=settings.AUTH_USER_MODEL)),
                ('to_group', models.ForeignKey(related_name='as_to_group', to='chat.ChatGroup')),
            ],
        ),
        migrations.CreateModel(
            name='UTUMessage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('content', models.TextField(max_length=800)),
                ('from_user', models.ForeignKey(related_name='as_from_user_utu', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(related_name='as_to_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
