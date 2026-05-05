from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0005_alter_donationrequest_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='donationrequest',
            name='is_approved',
        ),
        migrations.AddField(
            model_name='donationrequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=10),
        ),
    ]
